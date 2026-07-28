export function mapUser(row) {
  if (!row) return null;
  return {
    _id: row.id,
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    role: row.role,
    profilePic: row.profile_pic || '',
    details: row.details || '',
    fcmTokens: row.fcm_tokens || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapPackage(row) {
  if (!row) return null;
  return {
    _id: row.id,
    id: row.id,
    name: row.name,
    title: row.title,
    subtitle: row.subtitle,
    icon: row.icon,
    features: row.features || { en: [], ar: [] },
    delivery: row.delivery,
    priceUSD: row.price_usd,
    priceEGP: row.price_egp,
    featured: row.featured,
    order: row.sort_order,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapMaintenance(row) {
  if (!row) return null;
  return {
    _id: row.id,
    id: row.id,
    name: row.name,
    features: row.features || { en: [], ar: [] },
    priceUSD: row.price_usd,
    priceEGP: row.price_egp,
    order: row.sort_order,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
