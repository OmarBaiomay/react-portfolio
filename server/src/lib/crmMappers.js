export function mapLead(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    whatsapp: row.whatsapp,
    whatsappSameAsPhone: row.whatsapp_same_as_phone,
    service: row.service,
    message: row.message,
    status: row.status,
    source: row.source,
    notes: row.notes || '',
    assignedTo: row.assigned_to,
    convertedProjectId: row.converted_project_id,
    isArchived: row.is_archived,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapProject(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    description: row.description || '',
    status: row.status,
    leadId: row.lead_id,
    clientName: row.client_name || '',
    clientEmail: row.client_email || '',
    clientPhone: row.client_phone || '',
    startDate: row.start_date,
    dueDate: row.due_date,
    budget: row.budget != null ? Number(row.budget) : null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapMilestone(row) {
  if (!row) return null;
  return {
    id: row.id,
    projectId: row.project_id,
    title: row.title,
    description: row.description || '',
    status: row.status,
    dueDate: row.due_date,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapTask(row) {
  if (!row) return null;
  return {
    id: row.id,
    projectId: row.project_id,
    milestoneId: row.milestone_id,
    title: row.title,
    status: row.status,
    assigneeId: row.assignee_id,
    dueDate: row.due_date,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapLineItems(items) {
  if (!Array.isArray(items)) return [];
  return items.map((item) => ({
    description: item.description || '',
    qty: Number(item.qty) || 0,
    unitPrice: Number(item.unitPrice ?? item.unit_price) || 0,
    amount: Number(item.amount) || 0,
  }));
}

export function mapSalesDoc(row, type) {
  if (!row) return null;
  return {
    id: row.id,
    type,
    number: row.number,
    leadId: row.lead_id,
    projectId: row.project_id,
    quoteId: row.quote_id ?? null,
    contractId: row.contract_id ?? null,
    status: row.status,
    currency: row.currency || 'EGP',
    subtotal: Number(row.subtotal) || 0,
    tax: Number(row.tax) || 0,
    total: Number(row.total) || 0,
    issueDate: row.issue_date,
    validUntil: row.valid_until ?? null,
    dueDate: row.due_date ?? null,
    notes: row.notes || '',
    lineItems: mapLineItems(row.line_items),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function computeLineTotals(lineItems = [], tax = 0) {
  const items = (Array.isArray(lineItems) ? lineItems : []).map((item) => {
    const qty = Number(item.qty) || 0;
    const unitPrice = Number(item.unitPrice ?? item.unit_price) || 0;
    return {
      description: String(item.description || '').trim(),
      qty,
      unitPrice,
      amount: Math.round(qty * unitPrice * 100) / 100,
    };
  });
  const subtotal = Math.round(items.reduce((s, i) => s + i.amount, 0) * 100) / 100;
  const taxNum = Number(tax) || 0;
  const total = Math.round((subtotal + taxNum) * 100) / 100;
  return { lineItems: items, subtotal, tax: taxNum, total };
}
