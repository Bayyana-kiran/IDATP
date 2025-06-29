import type {
  AuditTrailData,
  BlockchainTransaction,
  UserCredential,
} from "../types/web3";

// Mock blockchain service for demonstration
class MockBlockchainService {
  private auditTrails: Map<string, AuditTrailData> = new Map();
  private transactionCount = 0;

  // Create data hash using simple hash function
  createDataHash(data: any): string {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `0x${Math.abs(hash).toString(16).padStart(64, "0")}`;
  }

  generateTransactionId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `TXN-0x${timestamp.toString(16)}${random}`;
  }

  generateBlockHash(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `0x${this.createDataHash(timestamp + random).substring(0, 32)}...`;
  }

  async createAuditTrail(
    auditData: AuditTrailData
  ): Promise<BlockchainTransaction> {
    // Simulate blockchain transaction delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const transactionId = this.generateTransactionId();
    const blockHash = this.generateBlockHash();
    const dataHash = this.createDataHash(auditData);

    const auditRecord: AuditTrailData = {
      ...auditData,
      id: `AT-2024-${String(++this.transactionCount).padStart(3, "0")}`,
      transactionId,
      blockHash,
      dataHash,
      timestamp: new Date().toISOString(),
      status: "verified",
    };

    this.auditTrails.set(auditRecord.id!, auditRecord);

    return {
      transactionHash: transactionId,
      blockHash,
      blockNumber: Math.floor(Math.random() * 1000000) + 1000000,
      gasUsed: Math.floor(Math.random() * 100000) + 21000,
      status: "success",
      timestamp: new Date().toISOString(),
    };
  }

  async getAuditTrail(id: string): Promise<AuditTrailData | null> {
    return this.auditTrails.get(id) || null;
  }

  async getAllAuditTrails(): Promise<AuditTrailData[]> {
    return Array.from(this.auditTrails.values()).sort(
      (a, b) =>
        new Date(b.timestamp!).getTime() - new Date(a.timestamp!).getTime()
    );
  }

  async verifyAuditIntegrity(
    auditData: AuditTrailData,
    storedHash: string
  ): Promise<boolean> {
    const computedHash = this.createDataHash(auditData);
    return computedHash === storedHash;
  }

  // DID (Decentralized Identity) utilities
  generateDID(address: string): string {
    return `did:pwc:${address.toLowerCase()}`;
  }

  createVerifiableCredential(userData: UserCredential) {
    const credential = {
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      type: ["VerifiableCredential", "PwCAuditorCredential"],
      issuer: "did:pwc:issuer",
      issuanceDate: new Date().toISOString(),
      credentialSubject: {
        id: this.generateDID(userData.address || "0x0"),
        name: userData.name,
        role: userData.role,
        department: userData.department,
        permissions: userData.permissions,
      },
      proof: {
        type: "Ed25519Signature2018",
        created: new Date().toISOString(),
        proofPurpose: "assertionMethod",
        verificationMethod: "did:pwc:issuer#keys-1",
        jws: this.createDataHash(userData),
      },
    };

    return credential;
  }

  // Smart contract simulation for compliance rules
  async executeComplianceCheck(auditData: AuditTrailData): Promise<{
    passed: boolean;
    violations: string[];
    riskScore: number;
  }> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const violations: string[] = [];
    let riskScore = 0;

    // Amount-based compliance
    if (auditData.amount && auditData.amount !== "-") {
      const amount = parseFloat(auditData.amount.replace(/[$,]/g, ""));
      if (amount > 100000) {
        violations.push("High-value transaction requires additional approval");
        riskScore += 30;
      }
      if (amount > 1000000) {
        violations.push("Transaction exceeds regulatory threshold");
        riskScore += 50;
      }
    }

    // Risk level compliance
    if (auditData.riskLevel === "high") {
      riskScore += 40;
      violations.push("High-risk transaction requires enhanced due diligence");
    }

    // Action-based compliance
    if (auditData.action.toLowerCase().includes("wire transfer")) {
      riskScore += 20;
    }

    return {
      passed: violations.length === 0,
      violations,
      riskScore: Math.min(riskScore, 100),
    };
  }
}

export const blockchainService = new MockBlockchainService();

// Initialize sample audit trails
const initializeSampleData = async () => {
  const sampleAudits: Omit<
    AuditTrailData,
    "id" | "transactionId" | "timestamp" | "blockHash" | "dataHash"
  >[] = [
    {
      action: "Financial Transaction",
      description: "Wire transfer of $500,000 to vendor account",
      amount: "$500,000",
      user: "John Smith",
      riskLevel: "high",
      status: "verified",
    },
    {
      action: "Contract Amendment",
      description: "Updated service agreement terms",
      amount: "-",
      user: "Maria Garcia",
      riskLevel: "medium",
      status: "verified",
    },
    {
      action: "Compliance Check",
      description: "Automated regulatory compliance verification",
      amount: "-",
      user: "System",
      riskLevel: "low",
      status: "verified",
    },
    {
      action: "Asset Transfer",
      description: "Transfer of digital assets between accounts",
      amount: "$75,000",
      user: "David Wilson",
      riskLevel: "medium",
      status: "verified",
    },
    {
      action: "Audit Review",
      description: "Quarterly financial audit review process",
      amount: "-",
      user: "Sarah Johnson",
      riskLevel: "low",
      status: "pending",
    },
  ];

  for (const audit of sampleAudits) {
    await blockchainService.createAuditTrail(audit as AuditTrailData);
  }
};

// Initialize data when module loads
if (typeof window !== "undefined") {
  initializeSampleData();
}
