import { NextRequest, NextResponse } from "next/server";
import { blockchainService } from "../../../lib/web3";
import type { AuditTrailData } from "../../../types/web3";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      // Get specific audit trail
      const auditTrail = await blockchainService.getAuditTrail(id);
      if (!auditTrail) {
        return NextResponse.json(
          { error: "Audit trail not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(auditTrail);
    } else {
      // Get all audit trails
      const auditTrails = await blockchainService.getAllAuditTrails();
      return NextResponse.json(auditTrails);
    }
  } catch (error) {
    console.error("Error fetching audit trails:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auditData: AuditTrailData = await request.json();

    // Validate required fields
    if (!auditData.action || !auditData.description || !auditData.user) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create audit trail on blockchain
    const transaction = await blockchainService.createAuditTrail(auditData);

    // Run compliance check
    const complianceResult = await blockchainService.executeComplianceCheck(
      auditData
    );

    return NextResponse.json({
      success: true,
      transaction,
      compliance: complianceResult,
      message: "Audit trail created successfully",
    });
  } catch (error) {
    console.error("Error creating audit trail:", error);
    return NextResponse.json(
      { error: "Failed to create audit trail" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const action = searchParams.get("action");

    if (!id) {
      return NextResponse.json(
        { error: "Audit trail ID required" },
        { status: 400 }
      );
    }

    if (action === "verify") {
      const auditTrail = await blockchainService.getAuditTrail(id);
      if (!auditTrail) {
        return NextResponse.json(
          { error: "Audit trail not found" },
          { status: 404 }
        );
      }

      const isValid = await blockchainService.verifyAuditIntegrity(
        auditTrail,
        auditTrail.dataHash!
      );

      return NextResponse.json({
        id,
        verified: isValid,
        message: isValid
          ? "Audit trail verified successfully"
          : "Audit trail integrity check failed",
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error verifying audit trail:", error);
    return NextResponse.json(
      { error: "Failed to verify audit trail" },
      { status: 500 }
    );
  }
}
