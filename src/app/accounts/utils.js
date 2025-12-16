"use client";

const uuidPattern = "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";

export const uuidRegex = new RegExp(`^${uuidPattern}$`, "i");

export const roleLabels = {
  supervisor: "المشرفين",
  patient: "المرضى",
  student: "الطلاب",
  university_admin: "مدراء الجامعات",
  tech_support: "الدعم التقني",
};

export const addActionLabels = {
  supervisor: "إضافة مشرف",
  patient: "إضافة مريض",
  student: "إضافة طالب",
  university_admin: "إضافة مدير جامعة",
  tech_support: "إضافة دعم تقني",
};

const baseUserFields = {
  id: "",
  user_id: "",
  username: "",
  email: "",
  password: "",
  password_confirm: "",
  first_name: "",
  last_name: "",
  date_of_birth: "",
  gender: "",
  phone_number: "",
  address: "",
  profile_picture: "",
};

export const initialForms = {
  supervisor: {
    ...baseUserFields,
    department: "",
    position: "",
    university: "",
    license_number: "",
  },
  patient: {
    ...baseUserFields,
    medical_history: "",
    allergies: "",
    medications: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
  },
  student: {
    ...baseUserFields,
    university: "",
    student_id: "",
    year_of_study: "",
    specialization: "",
  },
  university_admin: {
    ...baseUserFields,
    university: "",
    department: "",
    position: "",
  },
  tech_support: {
    ...baseUserFields,
    department: "",
    position: "",
  },
};

export const getInitialFormData = (role) => ({
  ...(initialForms[role] || initialForms.supervisor),
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


















