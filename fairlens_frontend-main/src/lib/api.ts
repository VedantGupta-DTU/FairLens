/**
 * FairLens API Client — connects React frontend to FastAPI backend
 */

const API_BASE = "http://localhost:8000/api";

export interface UploadResponse {
	session_id: string;
	filename: string;
	row_count: number;
	column_count: number;
	columns: string[];
	column_types: Record<string, string>;
	sample_data: Record<string, unknown>[];
}

export interface Finding {
	attribute: string;
	severity: "critical" | "warning" | "pass";
	title: string;
	metric?: string;
	group1?: { name: string; value: number };
	group2?: { name: string; value: number };
	disparate_impact?: number;
	threshold?: number;
}

export interface AnalyzeResponse {
	session_id: string;
	filename: string;
	row_count: number;
	column_count: number;
	protected_attributes: string[];
	outcome_column: string;
	score: number;
	findings: Finding[];
	detailed_tests: Record<string, unknown>[];
	total_tests: number;
	critical_count: number;
	warning_count: number;
	pass_count: number;
	ai_explanation: string;
}

export interface ChatResponse {
	response: string;
	session_id: string;
}

/**
 * Upload a CSV/JSON file for analysis
 */
export async function uploadFile(file: File): Promise<UploadResponse> {
	const formData = new FormData();
	formData.append("file", file);

	const res = await fetch(`${API_BASE}/upload`, {
		method: "POST",
		body: formData,
	});

	if (!res.ok) {
		const err = await res.json().catch(() => ({ detail: "Upload failed" }));
		throw new Error(err.detail || `Upload failed: ${res.status}`);
	}

	return res.json();
}

/**
 * Run bias analysis on uploaded dataset
 */
export async function analyzeDataset(
	sessionId: string,
	description: string = ""
): Promise<AnalyzeResponse> {
	const res = await fetch(`${API_BASE}/analyze`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ session_id: sessionId, description }),
	});

	if (!res.ok) {
		const err = await res.json().catch(() => ({ detail: "Analysis failed" }));
		throw new Error(err.detail || `Analysis failed: ${res.status}`);
	}

	return res.json();
}

/**
 * Get a saved report
 */
export async function getReport(sessionId: string): Promise<AnalyzeResponse> {
	const res = await fetch(`${API_BASE}/report/${sessionId}`);

	if (!res.ok) {
		const err = await res.json().catch(() => ({ detail: "Report not found" }));
		throw new Error(err.detail || `Report not found: ${res.status}`);
	}

	return res.json();
}

/**
 * Chat with AI about bias findings
 */
export async function chatWithAI(
	sessionId: string,
	message: string
): Promise<ChatResponse> {
	const res = await fetch(`${API_BASE}/chat`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ session_id: sessionId, message }),
	});

	if (!res.ok) {
		const err = await res.json().catch(() => ({ detail: "Chat failed" }));
		throw new Error(err.detail || `Chat failed: ${res.status}`);
	}

	return res.json();
}

/**
 * Check if backend is available
 */
export async function healthCheck(): Promise<boolean> {
	try {
		const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(3000) });
		return res.ok;
	} catch {
		return false;
	}
}
