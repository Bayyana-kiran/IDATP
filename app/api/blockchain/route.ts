import { NextRequest, NextResponse } from "next/server";
import { blockchainService } from "../../../lib/web3";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    switch (action) {
      case "stats":
        const auditTrails = await blockchainService.getAllAuditTrails();
        const stats = {
          totalTransactions: auditTrails.length,
          verifiedTransactions: auditTrails.filter(
            (a) => a.status === "verified"
          ).length,
          pendingTransactions: auditTrails.filter((a) => a.status === "pending")
            .length,
          failedTransactions: auditTrails.filter((a) => a.status === "failed")
            .length,
          highRiskTransactions: auditTrails.filter(
            (a) => a.riskLevel === "high"
          ).length,
          totalValue: auditTrails
            .filter((a) => a.amount && a.amount !== "-")
            .reduce(
              (sum, a) => sum + parseFloat(a.amount!.replace(/[$,]/g, "")),
              0
            ),
          complianceScore: Math.round(
            (auditTrails.filter((a) => a.status === "verified").length /
              auditTrails.length) *
              100
          ),
        };
        return NextResponse.json(stats);

      case "network-status":
        // Simulate network health check
        await new Promise((resolve) => setTimeout(resolve, 500));
        const auditTrailsForStatus =
          await blockchainService.getAllAuditTrails();
        const networkStatus = {
          blockchain: {
            status: "operational",
            blockHeight: Math.floor(Math.random() * 1000000) + 2000000,
            avgBlockTime: "2.3s",
            networkHash: blockchainService.generateBlockHash(),
          },
          security: {
            status: "secure",
            lastSecurityAudit: "2024-12-29T10:00:00Z",
            activeNodes: 47,
            consensusHealth: 99.8,
          },
          dataIntegrity: {
            status: "verified",
            lastIntegrityCheck: new Date().toISOString(),
            totalRecords: auditTrailsForStatus.length,
            verifiedRecords: auditTrailsForStatus.filter(
              (a) => a.status === "verified"
            ).length,
          },
          performance: {
            status: "monitoring",
            avgResponseTime: "150ms",
            throughput: "1,247 tx/min",
            uptime: "99.97%",
          },
        };
        return NextResponse.json(networkStatus);

      case "recent-blocks":
        // Generate mock recent blocks
        const recentBlocks = Array.from({ length: 5 }, (_, i) => ({
          blockNumber: Math.floor(Math.random() * 1000000) + 2000000 - i,
          blockHash: blockchainService.generateBlockHash(),
          timestamp: new Date(Date.now() - i * 15000).toISOString(),
          transactionCount: Math.floor(Math.random() * 50) + 1,
          miner: `0x${Math.random().toString(16).substring(2, 42)}`,
          gasUsed: Math.floor(Math.random() * 8000000) + 1000000,
        }));
        return NextResponse.json(recentBlocks);

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error fetching blockchain data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json();

    switch (action) {
      case "compliance-check":
        if (!data) {
          return NextResponse.json(
            { error: "Data required for compliance check" },
            { status: 400 }
          );
        }

        const complianceResult = await blockchainService.executeComplianceCheck(
          data
        );
        return NextResponse.json(complianceResult);

      case "generate-did":
        if (!data.address) {
          return NextResponse.json(
            { error: "Address required for DID generation" },
            { status: 400 }
          );
        }

        const did = blockchainService.generateDID(data.address);
        const credential = blockchainService.createVerifiableCredential(data);

        return NextResponse.json({
          did,
          credential,
          message: "DID and credential generated successfully",
        });

      case "verify-integrity":
        if (!data.auditData || !data.hash) {
          return NextResponse.json(
            { error: "Audit data and hash required" },
            { status: 400 }
          );
        }

        const isValid = await blockchainService.verifyAuditIntegrity(
          data.auditData,
          data.hash
        );
        return NextResponse.json({
          valid: isValid,
          message: isValid
            ? "Data integrity verified"
            : "Data integrity check failed",
        });

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error processing blockchain request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
