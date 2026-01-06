"use client";

const uuidPattern = "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";

export const uuidRegex = new RegExp(`^${uuidPattern}$`, "i");

export const roleLabels = {
  university_admin: "مدراء الجامعات",
};

export const addActionLabels = {
  university_admin: "إضافة مدير جامعة",
};

const baseUserFields = {
  id: "",
  user_id: "",
  username: "",
  email: "",
  first_name: "",
  last_name: "",
  password: "",
  password_confirm: "",
  date_of_birth: "",
  gender: "",
  phone_number: "",
  address: "",
  profile_picture: "",
  is_active: true,
};

export const initialForms = {
  university_admin: {
    ...baseUserFields,
    university: "",
    department: "",
    position: "",
  },
};

export const getInitialFormData = (role) => ({
  ...(initialForms[role] || initialForms.university_admin),
});

export const sanitizeValue = (value) => {
  if (value === undefined) return undefined;
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed === "" ? null : trimmed;
  }
  return value === "" ? null : value;
};

export const stripPayload = (payload, { preserveNull = true } = {}) => {
  const cleaned = { ...payload };
  Object.keys(cleaned).forEach((key) => {
    if (cleaned[key] === undefined) {
      delete cleaned[key];
    } else if (!preserveNull && cleaned[key] === null) {
      delete cleaned[key];
    }
  });
  return cleaned;
};

export const normalizeUniversityId = (rawValue, universities = []) => {
  if (!rawValue) {
    return null;
  }

  const stringValue = String(rawValue).trim();
  if (uuidRegex.test(stringValue)) {
    return stringValue;
  }

  const foundUni = universities.find((u) => {
    const uniId = u?.id ? String(u.id) : "";
    const uniName = u?.name ? String(u.name).trim().toLowerCase() : "";
    return (
      (uniId && uuidRegex.test(uniId) && uniId === stringValue) ||
      (uniName && uniName === stringValue.toLowerCase())
    );
  });

  if (foundUni && foundUni.id && uuidRegex.test(String(foundUni.id))) {
    return String(foundUni.id);
  }

  console.error("❌ لم يتم العثور على جامعة بـ UUID صحيح:", rawValue);
  return null;
};


















