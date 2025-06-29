"use client";

import Layout from "../components/Layout";
import { useState, useEffect } from "react";
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Calendar,
  FileText,
  Activity,
  TrendingUp,
  Download,
  Zap,
  Settings,
  Play,
  Pause,
  RefreshCw,
  Clock,
  DollarSign,
  Users,
  Database,
} from "lucide-react";

interface ComplianceRule {
  id: string;
  name: string;
  description: string;
  type:
    | "amount_limit"
    | "approval_required"
    | "risk_assessment"
    | "geographic_restriction";
  status: "active" | "inactive" | "pending";
  lastTriggered: string;
  triggerCount: number;
  coverage: number;
  riskLevel: "low" | "medium" | "high";
  parameters: Record<string, any>;
}

interface ComplianceMetrics {
  overallScore: number;
  totalRules: number;
  activeRules: number;
  violations: number;
  automatedChecks: number;
}

export default function Compliance() {
  const [complianceRules, setComplianceRules] = useState<ComplianceRule[]>([]);
  const [metrics, setMetrics] = useState<ComplianceMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [runningCheck, setRunningCheck] = useState<string | null>(null);
  const [selectedRule, setSelectedRule] = useState<ComplianceRule | null>(null);

  useEffect(() => {
    initializeComplianceData();
  }, []);

  const initializeComplianceData = () => {
    // Mock compliance rules with smart contract automation
    const mockRules: ComplianceRule[] = [
      {
        id: "CR-001",
        name: "High-Value Transaction Monitoring",
        description: "Automated monitoring of transactions exceeding $100,000",
        type: "amount_limit",
        status: "active",
        lastTriggered: new Date(Date.now() - 3600000).toISOString(),
        triggerCount: 23,
        coverage: 98.5,
        riskLevel: "high",
        parameters: {
          threshold: 100000,
          currency: "USD",
          timeWindow: "24h",
          approvalRequired: true,
        },
      },
      {
        id: "CR-002",
        name: "Multi-Signature Approval",
        description: "Requires multiple approvals for critical transactions",
        type: "approval_required",
        status: "active",
        lastTriggered: new Date(Date.now() - 7200000).toISOString(),
        triggerCount: 15,
        coverage: 100,
        riskLevel: "high",
        parameters: {
          minApprovals: 2,
          approverRoles: ["CFO", "Compliance Officer"],
          transactionTypes: ["wire_transfer", "contract_amendment"],
        },
      },
      {
        id: "CR-003",
        name: "Real-time Risk Assessment",
        description: "AI-powered risk scoring for all transactions",
        type: "risk_assessment",
        status: "active",
        lastTriggered: new Date(Date.now() - 1800000).toISOString(),
        triggerCount: 156,
        coverage: 95.2,
        riskLevel: "medium",
        parameters: {
          riskThreshold: 0.75,
          mlModel: "risk_analyzer_v2.1",
          factors: ["amount", "frequency", "geography", "counterparty"],
        },
      },
    ];

    const mockMetrics: ComplianceMetrics = {
      overallScore: 96.8,
      totalRules: mockRules.length,
      activeRules: mockRules.filter((r) => r.status === "active").length,
      violations: 3,
      automatedChecks: mockRules.reduce(
        (sum, rule) => sum + rule.triggerCount,
        0
      ),
    };

    setComplianceRules(mockRules);
    setMetrics(mockMetrics);
    setLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "inactive":
        return <XCircle className="h-4 w-4 text-gray-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-orange-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  const getRiskBadge = (risk: string) => {
    const colors = {
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-red-100 text-red-800",
    };
    return colors[risk as keyof typeof colors] || colors.low;
  };

  const runComplianceCheck = async (ruleId: string) => {
    setRunningCheck(ruleId);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = await fetch("/api/blockchain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "compliance-check",
          data: { ruleId },
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(
          `Compliance check completed. Risk Score: ${result.riskScore}. Violations: ${result.violations.length}`
        );

        setComplianceRules((prev) =>
          prev.map((rule) =>
            rule.id === ruleId
              ? {
                  ...rule,
                  triggerCount: rule.triggerCount + 1,
                  lastTriggered: new Date().toISOString(),
                }
              : rule
          )
        );
      }
    } catch (error) {
      console.error("Error running compliance check:", error);
      alert("Error running compliance check");
    } finally {
      setRunningCheck(null);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-6 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">
              Loading smart contract compliance rules...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="border-b border-gray-200 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Smart Contract Compliance
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Automated compliance monitoring and enforcement using smart
                contracts
              </p>
            </div>
          </div>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-50">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Overall Score
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {metrics?.overallScore}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-50">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Active Rules
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {metrics?.activeRules}/{metrics?.totalRules}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-red-50">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Violations</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {metrics?.violations}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-50">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Auto Checks</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {metrics?.automatedChecks.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-orange-50">
                <Activity className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Avg Response
                </p>
                <p className="text-2xl font-semibold text-gray-900">2.1s</p>
              </div>
            </div>
          </div>
        </div>

        {/* Compliance Rules */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Smart Contract Compliance Rules
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Automated rules executed on blockchain for real-time compliance
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rule Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type & Risk
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Execution Stats
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {complianceRules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {rule.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {rule.description}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          ID: {rule.id}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900 capitalize">
                          {rule.type.replace("_", " ")}
                        </div>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getRiskBadge(
                            rule.riskLevel
                          )}`}
                        >
                          {rule.riskLevel} Risk
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(rule.status)}
                        <span className="text-sm text-gray-900 capitalize">
                          {rule.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">
                          {rule.triggerCount} executions
                        </div>
                        <div className="text-xs text-gray-500">
                          Last: {new Date(rule.lastTriggered).toLocaleString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => runComplianceCheck(rule.id)}
                          disabled={runningCheck === rule.id}
                          className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                          title="Run Check"
                        >
                          {runningCheck === rule.id ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => setSelectedRule(rule)}
                          className="text-gray-600 hover:text-gray-900"
                          title="Configure"
                        >
                          <Settings className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Compliance Events */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Recent Compliance Events
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Real-time blockchain compliance events and violations
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                {
                  id: 1,
                  event: "High-Value Transaction Flagged",
                  description:
                    "Transaction of $750,000 triggered automatic review",
                  timestamp: "5 minutes ago",
                  severity: "warning",
                  ruleId: "CR-001",
                },
                {
                  id: 2,
                  event: "Multi-Signature Approval Completed",
                  description:
                    "Contract amendment approved by 2 of 2 required signers",
                  timestamp: "15 minutes ago",
                  severity: "success",
                  ruleId: "CR-002",
                },
                {
                  id: 3,
                  event: "Risk Assessment Completed",
                  description: "AI model scored transaction as low risk (0.23)",
                  timestamp: "2 hours ago",
                  severity: "success",
                  ruleId: "CR-003",
                },
              ].map((event) => (
                <div key={event.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {event.severity === "success" ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : event.severity === "warning" ? (
                      <AlertTriangle className="h-5 w-5 text-orange-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {event.event}
                    </p>
                    <p className="text-sm text-gray-500">{event.description}</p>
                    <div className="flex items-center mt-1 space-x-2">
                      <span className="text-xs text-gray-400">
                        {event.timestamp}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-600">
                        Rule: {event.ruleId}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rule Configuration Modal */}
        {selectedRule && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Configure Smart Contract Rule
                  </h3>
                  <button
                    onClick={() => setSelectedRule(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Rule Name
                    </label>
                    <p className="text-sm text-gray-900">{selectedRule.name}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedRule.description}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Parameters
                    </label>
                    <div className="bg-gray-50 rounded-md p-3 mt-1">
                      <pre className="text-xs text-gray-700">
                        {JSON.stringify(selectedRule.parameters, null, 2)}
                      </pre>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Status
                      </label>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(selectedRule.status)}
                        <span className="text-sm text-gray-900 capitalize">
                          {selectedRule.status}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Risk Level
                      </label>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskBadge(
                          selectedRule.riskLevel
                        )}`}
                      >
                        {selectedRule.riskLevel.charAt(0).toUpperCase() +
                          selectedRule.riskLevel.slice(1)}{" "}
                        Risk
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => runComplianceCheck(selectedRule.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Test Rule
                  </button>
                  <button
                    onClick={() => setSelectedRule(null)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
