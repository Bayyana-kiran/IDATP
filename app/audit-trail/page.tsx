"use client";

import Layout from "../components/Layout";
import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Download,
  Plus,
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock,
  Shield,
  Hash,
  ExternalLink,
  Eye,
  RefreshCw,
  X,
} from "lucide-react";

interface AuditTrail {
  id: string;
  transactionId: string;
  blockHash?: string;
  timestamp: string;
  action: string;
  description: string;
  amount: string;
  status: "verified" | "pending" | "failed";
  user: string;
  riskLevel: "low" | "medium" | "high";
  dataHash?: string;
}

export default function AuditTrail() {
  const [auditTrails, setAuditTrails] = useState<AuditTrail[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [verifying, setVerifying] = useState<string | null>(null);
  const [selectedAudit, setSelectedAudit] = useState<AuditTrail | null>(null);

  useEffect(() => {
    fetchAuditTrails();
  }, []);

  const fetchAuditTrails = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/audit");
      const data = await response.json();
      setAuditTrails(data);
    } catch (error) {
      console.error("Error fetching audit trails:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTrails = auditTrails.filter((trail) => {
    const matchesSearch =
      trail.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trail.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trail.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trail.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || trail.status === statusFilter;
    const matchesRisk = riskFilter === "all" || trail.riskLevel === riskFilter;
    return matchesSearch && matchesStatus && matchesRisk;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
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

  const verifyAuditTrail = async (auditId: string) => {
    setVerifying(auditId);
    try {
      const response = await fetch(`/api/audit?id=${auditId}&action=verify`, {
        method: "PUT",
      });
      const result = await response.json();

      if (result.verified) {
        alert("Audit trail verified successfully!");
      } else {
        alert("Audit trail verification failed!");
      }

      await fetchAuditTrails(); // Refresh data
    } catch (error) {
      console.error("Error verifying audit trail:", error);
      alert("Error verifying audit trail");
    } finally {
      setVerifying(null);
    }
  };

  const exportAuditData = () => {
    const csvContent = [
      [
        "ID",
        "Transaction ID",
        "Block Hash",
        "Timestamp",
        "Action",
        "Description",
        "Amount",
        "Status",
        "User",
        "Risk Level",
      ].join(","),
      ...filteredTrails.map((trail) =>
        [
          trail.id,
          trail.transactionId,
          trail.blockHash || "",
          trail.timestamp,
          trail.action,
          `"${trail.description}"`,
          trail.amount,
          trail.status,
          trail.user,
          trail.riskLevel,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-trails-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-6 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading blockchain audit trails...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Blockchain Audit Trail
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Immutable audit records stored on blockchain with smart contract
              verification
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={fetchAuditTrails}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
            <button
              onClick={exportAuditData}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Audit Trail
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search audit trails..."
                  className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Risk Level
              </label>
              <select
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
              >
                <option value="all">All Risk Levels</option>
                <option value="low">Low Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="high">High Risk</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Results
              </label>
              <div className="text-sm text-gray-600 py-2">
                Showing {filteredTrails.length} of {auditTrails.length} records
              </div>
            </div>
          </div>
        </div>

        {/* Audit Trails Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Audit Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Blockchain Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status & Risk
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTrails.map((trail) => (
                  <tr key={trail.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {trail.action}
                        </div>
                        <div className="text-sm text-gray-500">
                          {trail.description}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          ID: {trail.id}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(trail.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="flex items-center text-sm text-gray-900">
                          <Hash className="h-3 w-3 mr-1" />
                          <span className="font-mono text-xs">
                            {trail.transactionId.substring(0, 16)}...
                          </span>
                        </div>
                        {trail.blockHash && (
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <span className="font-mono">
                              Block: {trail.blockHash.substring(0, 12)}...
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {trail.amount}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(trail.status)}
                        <span className="text-sm text-gray-900 capitalize">
                          {trail.status}
                        </span>
                      </div>
                      <div className="mt-1">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskBadge(
                            trail.riskLevel
                          )}`}
                        >
                          {trail.riskLevel.charAt(0).toUpperCase() +
                            trail.riskLevel.slice(1)}{" "}
                          Risk
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{trail.user}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedAudit(trail)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => verifyAuditTrail(trail.id)}
                          disabled={verifying === trail.id}
                          className="text-green-600 hover:text-green-900 disabled:opacity-50"
                          title="Verify on Blockchain"
                        >
                          <Shield className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() =>
                            window.open(
                              `https://etherscan.io/tx/${trail.transactionId}`,
                              "_blank"
                            )
                          }
                          className="text-gray-600 hover:text-gray-900"
                          title="View on Block Explorer"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Detail Modal */}
        {selectedAudit && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Audit Trail Details
                  </h3>
                  <button
                    onClick={() => setSelectedAudit(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        ID
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedAudit.id}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Status
                      </label>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(selectedAudit.status)}
                        <span className="text-sm text-gray-900 capitalize">
                          {selectedAudit.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Action
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedAudit.action}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedAudit.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Amount
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedAudit.amount}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Risk Level
                      </label>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskBadge(
                          selectedAudit.riskLevel
                        )}`}
                      >
                        {selectedAudit.riskLevel.charAt(0).toUpperCase() +
                          selectedAudit.riskLevel.slice(1)}{" "}
                        Risk
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Transaction ID
                    </label>
                    <p className="text-sm text-gray-900 font-mono">
                      {selectedAudit.transactionId}
                    </p>
                  </div>

                  {selectedAudit.blockHash && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Block Hash
                      </label>
                      <p className="text-sm text-gray-900 font-mono">
                        {selectedAudit.blockHash}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        User
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedAudit.user}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Timestamp
                      </label>
                      <p className="text-sm text-gray-900">
                        {new Date(selectedAudit.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => verifyAuditTrail(selectedAudit.id)}
                    disabled={verifying === selectedAudit.id}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    {verifying === selectedAudit.id
                      ? "Verifying..."
                      : "Verify on Blockchain"}
                  </button>
                  <button
                    onClick={() => setSelectedAudit(null)}
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
