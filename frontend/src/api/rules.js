const API_URL = "http://127.0.0.1:8000/api/auth"; 

export async function getRules() {
  const res = await fetch(`${API_URL}/rules/`);
  if (!res.ok) throw new Error("Failed to fetch rules");
  return await res.json();
}

export async function createRule(newRule) {
  const res = await fetch(`${API_URL}/rules/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newRule),
  });
  if (!res.ok) throw new Error("Failed to create rule");
  return await res.json();
}

export async function updateRule(id, updates) {
  const res = await fetch(`${API_URL}/rules/${id}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update rule");
  return await res.json();
}

export async function deleteRule(id) {
  const res = await fetch(`${API_URL}/rules/${id}/`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete rule");
}
