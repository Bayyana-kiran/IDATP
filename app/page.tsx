"use client";

import Layout from "./components/Layout";
import { useState, useEffect } from "react";
import {
  BarChart3,
  Shield,
  FileText,
  Users,
  Activity,
  CheckCircle,
  AlertTriangle,
  Clock,
  Plus,
  Hash,
  Database,
  Zap,
} from "lucide-react";

interface BlockchainStats {
  totalTransactions: number;
  verifiedTransactions: number;
  pendingTransactions: number;
  highRiskTransactions: number;
  totalValue: number;
  complianceScore: number;
}

interface NetworkStatus {
  blockchain: {
    status: string;
    blockHeight: number;
    avgBlockTime: string;
    networkHash: string;
  };
  security: {
    status: string;
    lastSecurityAudit: string;
    activeNodes: number;
    consensusHealth: number;
  };
  dataIntegrity: {
    status: string;
    lastIntegrityCheck: string;
    totalRecords: number;
    verifiedRecords: number;
  };
  performance: {
    status: string;
    avgResponseTime: string;
    throughput: string;
    uptime: string;
  };
}

interface RecentActivity {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  status: string;
  user: string;
  transactionId?: string;
  blockHash?: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<BlockchainStats | null>(null);
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus | null>(
    null
  );
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, networkResponse, auditResponse] = await Promise.all(
        [
          fetch("/api/blockchain?action=stats"),
          fetch("/api/blockchain?action=network-status"),
          fetch("/api/audit"),
        ]
      );

      const statsData = await statsResponse.json();
      const networkData = await networkResponse.json();
      const auditData = await auditResponse.json();

      setStats(statsData);
      setNetworkStatus(networkData);

      // Transform audit data to recent activities
      const activities = auditData.slice(0, 4).map((audit: any) => ({
        id: audit.id,
        action: audit.action,
        description: audit.description,
        timestamp: new Date(audit.timestamp).toLocaleString(),
        status: audit.status,
        user: audit.user,
        transactionId: audit.transactionId,
        blockHash: audit.blockHash,
      }));

      setRecentActivities(activities);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  const createQuickAudit = async (action: string) => {
    setCreating(true);
    try {
      const auditData = {
        action: action,
        description: `Quick ${action.toLowerCase()} created from dashboard`,
        amount:
          action === "Log Transaction"
            ? `$${Math.floor(Math.random() * 100000) + 1000}`
            : "-",
        user: "Admin User",
        riskLevel:
          action === "Log Transaction"
            ? "medium"
            : ("low" as "low" | "medium" | "high"),
      };

      const response = await fetch("/api/audit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(auditData),
      });

      if (response.ok) {
        // Refresh dashboard data
        await fetchDashboardData();
      }
    } catch (error) {
      console.error("Error creating audit:", error);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-6 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading blockchain data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const displayStats = [
    {
      name: "Total Transactions",
      value: stats?.totalTransactions.toLocaleString() || "0",
      icon: BarChart3,
      color: "blue",
    },
    {
      name: "Compliance Score",
      value: `${stats?.complianceScore || 0}%`,
      icon: Shield,
      color: "green",
    },
    {
      name: "Pending Audits",
      value: stats?.pendingTransactions.toString() || "0",
      icon: FileText,
      color: "orange",
    },
    {
      name: "High Risk Items",
      value: stats?.highRiskTransactions.toString() || "0",
      icon: AlertTriangle,
      color: "red",
    },
  ];

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-semibold text-gray-900">
            Blockchain Audit Dashboard
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Real-time overview of blockchain audit trail activities and
            compliance status
          </p>
          <div className="mt-2 flex items-center space-x-4 text-xs">
            <span className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
              Live Blockchain Data
            </span>
            <span className="text-gray-500">
              Block Height:{" "}
              {networkStatus?.blockchain.blockHeight.toLocaleString()}
            </span>
            <span className="text-gray-500">
              Network Hash:{" "}
              {networkStatus?.blockchain.networkHash.substring(0, 16)}...
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayStats.map((stat) => (
            <div
              key={stat.name}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <div
                  className={`
                  p-3 rounded-lg
                  ${stat.color === "blue" ? "bg-blue-50" : ""}
                  ${stat.color === "green" ? "bg-green-50" : ""}
                  ${stat.color === "orange" ? "bg-orange-50" : ""}
                  ${stat.color === "red" ? "bg-red-50" : ""}
                `}
                >
                  <stat.icon
                    className={`
                    h-6 w-6
                    ${stat.color === "blue" ? "text-blue-600" : ""}
                    ${stat.color === "green" ? "text-green-600" : ""}
                    ${stat.color === "orange" ? "text-orange-600" : ""}
                    ${stat.color === "red" ? "text-red-600" : ""}
                  `}
                  />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Recent Blockchain Activity
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Latest audit trail activities recorded on blockchain
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {activity.status === "verified" ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : activity.status === "pending" ? (
                        <Clock className="h-5 w-5 text-orange-500" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.action}
                      </p>
                      <p className="text-sm text-gray-500">
                        {activity.description}
                      </p>
                      <div className="flex items-center mt-1 space-x-2">
                        <span className="text-xs text-gray-400">
                          {activity.timestamp}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-600">
                          {activity.user}
                        </span>
                      </div>
                      {activity.transactionId && (
                        <div className="mt-1 flex items-center space-x-1">
                          <Hash className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500 font-mono">
                            {activity.transactionId.substring(0, 20)}...
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Blockchain Network Status
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Real-time blockchain and system health metrics
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Activity className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-sm font-medium text-gray-900">
                    Blockchain Network
                  </span>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {networkStatus?.blockchain.status || "Operational"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-sm font-medium text-gray-900">
                    Security Status
                  </span>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {networkStatus?.security.status || "Secure"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Database className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-sm font-medium text-gray-900">
                    Data Integrity
                  </span>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {networkStatus?.dataIntegrity.status || "Verified"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Zap className="h-5 w-5 text-orange-500 mr-3" />
                  <span className="text-sm font-medium text-gray-900">
                    Performance
                  </span>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  {networkStatus?.performance.status || "Monitoring"}
                </span>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Response Time:</span>
                    <span className="ml-1 font-medium">
                      {networkStatus?.performance.avgResponseTime}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Throughput:</span>
                    <span className="ml-1 font-medium">
                      {networkStatus?.performance.throughput}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Active Nodes:</span>
                    <span className="ml-1 font-medium">
                      {networkStatus?.security.activeNodes}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Uptime:</span>
                    <span className="ml-1 font-medium">
                      {networkStatus?.performance.uptime}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Smart Contract Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Smart Contract Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => createQuickAudit("Create Audit Trail")}
              disabled={creating}
              className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileText className="h-5 w-5 text-gray-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">
                {creating ? "Creating..." : "Create Audit Trail"}
              </span>
            </button>
            <button
              onClick={() => createQuickAudit("Log Transaction")}
              disabled={creating}
              className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <BarChart3 className="h-5 w-5 text-gray-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">
                Log Transaction
              </span>
            </button>
            <button
              onClick={() => createQuickAudit("Run Compliance Check")}
              disabled={creating}
              className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Shield className="h-5 w-5 text-gray-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">
                Run Compliance Check
              </span>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
