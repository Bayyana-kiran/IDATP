"use client";

import Layout from "../components/Layout";
import { useState } from "react";
import {
  FileText,
  Download,
  Calendar,
  Filter,
  Eye,
  BarChart3,
  PieChart,
  TrendingUp,
  Clock,
} from "lucide-react";

const reports = [
  {
    id: "RPT-001",
    title: "Monthly Compliance Report",
    description: "Comprehensive compliance status for December 2024",
    type: "compliance",
    status: "ready",
    generatedDate: "2024-12-30 14:00:00",
    size: "2.4 MB",
    format: "PDF",
    downloadCount: 12,
  },
  {
    id: "RPT-002",
    title: "Transaction Audit Trail",
    description: "Complete audit trail for Q4 2024 transactions",
    type: "audit",
    status: "ready",
    generatedDate: "2024-12-30 13:30:00",
    size: "8.7 MB",
    format: "PDF",
    downloadCount: 8,
  },
  {
    id: "RPT-003",
    title: "Risk Assessment Dashboard",
    description: "Real-time risk analysis and metrics",
    type: "risk",
    status: "generating",
    generatedDate: "2024-12-30 15:00:00",
    size: "-",
    format: "PDF",
    downloadCount: 0,
  },
  {
    id: "RPT-004",
    title: "Financial Summary Report",
    description: "Year-end financial performance summary",
    type: "financial",
    status: "ready",
    generatedDate: "2024-12-30 12:00:00",
    size: "1.8 MB",
    format: "Excel",
    downloadCount: 25,
  },
  {
    id: "RPT-005",
    title: "Blockchain Analytics",
    description: "Blockchain transaction analysis and insights",
    type: "blockchain",
    status: "ready",
    generatedDate: "2024-12-30 11:45:00",
    size: "3.2 MB",
    format: "PDF",
    downloadCount: 6,
  },
];

const reportTypes = [
  { value: "all", label: "All Reports" },
  { value: "compliance", label: "Compliance" },
  { value: "audit", label: "Audit" },
  { value: "risk", label: "Risk" },
  { value: "financial", label: "Financial" },
  { value: "blockchain", label: "Blockchain" },
];

export default function Reports() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState("30");

  const filteredReports = reports.filter((report) => {
    const matchesType = typeFilter === "all" || report.type === typeFilter;
    const matchesStatus =
      statusFilter === "all" || report.status === statusFilter;
    return matchesType && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ready":
        return "bg-green-100 text-green-800";
      case "generating":
        return "bg-orange-100 text-orange-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "compliance":
        return <FileText className="h-5 w-5 text-blue-600" />;
      case "audit":
        return <Eye className="h-5 w-5 text-green-600" />;
      case "risk":
        return <TrendingUp className="h-5 w-5 text-red-600" />;
      case "financial":
        return <BarChart3 className="h-5 w-5 text-purple-600" />;
      case "blockchain":
        return <PieChart className="h-5 w-5 text-orange-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const generateReport = (type: string) => {
    // Simulate report generation
    console.log(`Generating ${type} report...`);
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="border-b border-gray-200 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Reports & Analytics
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Generate and manage audit reports and compliance documentation
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button
                onClick={() => generateReport("custom")}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <FileText className="h-4 w-4 mr-2" />
                Generate Custom Report
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={() => generateReport("compliance")}
            className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  Compliance Report
                </p>
                <p className="text-xs text-gray-500">Generate now</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => generateReport("audit")}
            className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center">
              <div className="p-2 bg-green-50 rounded-lg">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Audit Trail</p>
                <p className="text-xs text-gray-500">Generate now</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => generateReport("risk")}
            className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center">
              <div className="p-2 bg-red-50 rounded-lg">
                <TrendingUp className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  Risk Assessment
                </p>
                <p className="text-xs text-gray-500">Generate now</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => generateReport("financial")}
            className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center">
              <div className="p-2 bg-purple-50 rounded-lg">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  Financial Summary
                </p>
                <p className="text-xs text-gray-500">Generate now</p>
              </div>
            </div>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
              >
                {reportTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
              >
                <option value="all">All Status</option>
                <option value="ready">Ready</option>
                <option value="generating">Generating</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
            </div>

            <div className="flex items-end">
              <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                <Filter className="h-4 w-4 mr-2" />
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Report
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Generated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Downloads
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {getTypeIcon(report.type)}
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {report.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {report.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 capitalize">
                        {report.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                          report.status
                        )}`}
                      >
                        {report.status === "generating" && (
                          <Clock className="h-3 w-3 mr-1" />
                        )}
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.generatedDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.downloadCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="h-4 w-4" />
                        </button>
                        {report.status === "ready" && (
                          <button className="text-green-600 hover:text-green-900">
                            <Download className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Report Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-50">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Total Reports
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {reports.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-50">
                <Download className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Total Downloads
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {reports.reduce(
                    (sum, report) => sum + report.downloadCount,
                    0
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-orange-50">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">This Month</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {
                    reports.filter((r) => r.generatedDate.includes("2024-12"))
                      .length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
