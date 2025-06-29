declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (
        event: string,
        callback: (...args: any[]) => void
      ) => void;
      isMetaMask?: boolean;
    };
  }
}

export interface AuditTrailData {
  id?: string;
  transactionId: string;
  action: string;
  description: string;
  amount: string;
  user: string;
  riskLevel: "low" | "medium" | "high";
  status: "pending" | "verified" | "failed";
  timestamp?: string;
  blockHash?: string;
  dataHash?: string;
}

export interface BlockchainTransaction {
  transactionHash: string;
  blockHash: string;
  blockNumber: number;
  gasUsed: number;
  status: string;
  timestamp: string;
}

export interface UserCredential {
  name: string;
  role: string;
  department: string;
  address?: string;
  permissions: string[];
}

export interface ComplianceRule {
  id: string;
  name: string;
  description: string;
  type:
    | "amount_limit"
    | "approval_required"
    | "risk_assessment"
    | "geographic_restriction";
  parameters: Record<string, any>;
  active: boolean;
}

export interface SmartContractEvent {
  event: string;
  args: any[];
  blockNumber: number;
  transactionHash: string;
  timestamp: string;
}

export {};
