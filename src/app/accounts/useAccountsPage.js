"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAccounts,
  createAccount,
  updateAccountAsync,
  deleteAccountAsync,
  getAccountDetails,
  clearError,
  fetchPatients,
  createPatient,
  updatePatient,
  deletePatient,
  getPatientDetails,
  fetchStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentDetails,
  fetchUniversityAdmins,
  createUniversityAdmin,
  updateUniversityAdmin,
  deleteUniversityAdmin,
  getUniversityAdminDetails,
  fetchTechSupport,
  createTechSupport,
  updateTechSupport,
  deleteTechSupport,
  getTechSupportDetails,
} from "@/redux/slices/accountsSlice";
import { fetchUniversities } from "@/redux/slices/universitiesSlice";
import {
  addActionLabels,
  getInitialFormData,
  normalizeUniversityId,
  roleLabels,
  sanitizeValue,
  stripPayload,
  uuidRegex,
} from "./utils";

export default function useAccountsPage() {
  const dispatch = useDispatch();
  const {
    users,
    patients,
    students,
    universityAdmins,
    techSupport,
    loading,
    error,
    operationLoading,
    operationError,
  } = useSelector((state) => state.accounts);
  const { universities } = useSelector((state) => state.universities);

  const [activeRole, setActiveRole] = useState("supervisor");
  const [formData, setFormData] = useState(() => getInitialFormData("supervisor"));
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    dispatch(fetchAccounts());
    dispatch(fetchPatients());
    dispatch(fetchStudents());
    dispatch(fetchUniversityAdmins());
    dispatch(fetchTechSupport());
    dispatch(fetchUniversities());
  }, [dispatch]);

  useEffect(() => {
    setFormData(getInitialFormData(activeRole));
    setIsEditing(false);
    dispatch(clearError());
  }, [activeRole, dispatch]);

  const roleCollections = useMemo(
    () => ({
      supervisor: users,
      patient: patients,
      student: students,
      university_admin: universityAdmins,
      tech_support: techSupport,
    }),
    [users, patients, students, universityAdmins, techSupport]
  );

  const displayedUsers = roleCollections[activeRole] || [];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "university" && value) {
      const normalized = normalizeUniversityId(value, universities);
      setFormData({ ...formData, [name]: normalized || "" });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const resetFormState = (role = activeRole) => {
    setFormData(getInitialFormData(role));
    setIsEditing(false);
    dispatch(clearError());
  };

  const submitSupervisor = async () => {
    const userIdCandidate = formData.user_id || formData.id;

    const normalizedUniversityId = normalizeUniversityId(formData.university, universities);

    const profileUpdateFields = {
      department: sanitizeValue(formData.department),
      position: sanitizeValue(formData.position),
      date_of_birth: sanitizeValue(formData.date_of_birth),
      gender: sanitizeValue(formData.gender),
      university: normalizedUniversityId,
      phone_number: sanitizeValue(formData.phone_number),
      address: sanitizeValue(formData.address),
      license_number: sanitizeValue(formData.license_number),
      profile_picture: sanitizeValue(formData.profile_picture),
    };

    if (isEditing) {
      if (!userIdCandidate) {
        alert("❌ لا يوجد معرف للحساب المحدد للتعديل");
        return;
      }

      const updatePayload = stripPayload(
        {
          first_name: sanitizeValue(formData.first_name),
          last_name: sanitizeValue(formData.last_name),
          ...profileUpdateFields,
        },
        { preserveNull: true }
      );

      const userId = String(userIdCandidate);
      try {
        const result = await dispatch(updateAccountAsync({ user_id: userId, data: updatePayload }));
        if (result.type === "accounts/updateAccountAsync/fulfilled") {
          await dispatch(fetchAccounts());
          resetFormState("supervisor");
          alert("✅ تم تحديث المشرف بنجاح");
        } else if (result.type === "accounts/updateAccountAsync/rejected") {
          alert(`❌ فشل التحديث: ${result.payload}`);
        }
      } catch (err) {
        alert(`❌ خطأ في التحديث: ${err.message}`);
      }
      return;
    }

    const { university: _ignoredUniversityField, ...profileUpdateWithoutUniversity } = profileUpdateFields;

    const createPayload = stripPayload(
      {
        username: formData.username?.trim(),
        email: formData.email?.trim(),
        password: formData.password,
        password_confirm: formData.password_confirm || formData.password,
        first_name: sanitizeValue(formData.first_name),
        last_name: sanitizeValue(formData.last_name),
        university_id: normalizedUniversityId,
        ...profileUpdateWithoutUniversity,
      },
      { preserveNull: false }
    );

    try {
      const result = await dispatch(createAccount(createPayload));
      if (result.type === "accounts/createAccount/fulfilled") {
        const createdUser = result.payload;
        const createdUserId =
          createdUser?.user_id || createdUser?.id || createdUser?.original_user_id;

        const postCreateOptionalFields = stripPayload(profileUpdateFields, { preserveNull: false });

        const completeRefresh = async () => {
          await dispatch(fetchAccounts());
          alert("✅ تم إنشاء المشرف بنجاح");
          resetFormState("supervisor");
        };

        if (createdUserId && Object.keys(postCreateOptionalFields).length > 0) {
          try {
            await dispatch(
              updateAccountAsync({ user_id: String(createdUserId), data: postCreateOptionalFields })
            );
          } catch (error) {
            console.error("❌ خطأ في تحديث الحقول الاختيارية بعد الإنشاء:", error);
          } finally {
            await completeRefresh();
          }
        } else {
          await completeRefresh();
        }
      } else if (result.type === "accounts/createAccount/rejected") {
        alert(`❌ فشل الإنشاء: ${result.payload}`);
      }
    } catch (err) {
      alert(`❌ خطأ في الإنشاء: ${err.message}`);
    }
  };

  const submitPatient = async () => {
    const userIdCandidate = formData.user_id || formData.id;

    if (isEditing) {
      if (!userIdCandidate) {
        alert("❌ لا يوجد ID للحساب المحدد للتعديل");
        return;
      }

      const userId = String(userIdCandidate);
      const updatePayload = stripPayload(
        {
          first_name: sanitizeValue(formData.first_name),
          last_name: sanitizeValue(formData.last_name),
          phone_number: sanitizeValue(formData.phone_number),
          address: sanitizeValue(formData.address),
          date_of_birth: sanitizeValue(formData.date_of_birth),
          gender: sanitizeValue(formData.gender),
          profile_picture: sanitizeValue(formData.profile_picture),
          medical_history: sanitizeValue(formData.medical_history),
          allergies: sanitizeValue(formData.allergies),
          medications: sanitizeValue(formData.medications),
          emergency_contact_name: sanitizeValue(formData.emergency_contact_name),
          emergency_contact_phone: sanitizeValue(formData.emergency_contact_phone),
        },
        { preserveNull: true }
      );

      try {
        const result = await dispatch(updatePatient({ user_id: userId, data: updatePayload }));
        if (result.type === "accounts/updatePatient/fulfilled") {
          await dispatch(fetchPatients());
          resetFormState("patient");
          alert("✅ تم تحديث بيانات المريض بنجاح");
        } else if (result.type === "accounts/updatePatient/rejected") {
          alert(`❌ فشل التحديث: ${result.payload}`);
        }
      } catch (err) {
        alert(`❌ خطأ في التحديث: ${err.message}`);
      }
      return;
    }

    const createPayload = stripPayload(
      {
        username: formData.username?.trim(),
        email: formData.email?.trim(),
        password: formData.password,
        password_confirm: formData.password_confirm || formData.password,
        first_name: sanitizeValue(formData.first_name),
        last_name: sanitizeValue(formData.last_name),
      },
      { preserveNull: false }
    );

    const optionalPatientFields = stripPayload(
      {
        phone_number: sanitizeValue(formData.phone_number),
        address: sanitizeValue(formData.address),
        date_of_birth: sanitizeValue(formData.date_of_birth),
        gender: sanitizeValue(formData.gender),
        profile_picture: sanitizeValue(formData.profile_picture),
        medical_history: sanitizeValue(formData.medical_history),
        allergies: sanitizeValue(formData.allergies),
        medications: sanitizeValue(formData.medications),
        emergency_contact_name: sanitizeValue(formData.emergency_contact_name),
        emergency_contact_phone: sanitizeValue(formData.emergency_contact_phone),
      },
      { preserveNull: false }
    );

    try {
      const result = await dispatch(createPatient(createPayload));
      if (result.type === "accounts/createPatient/fulfilled") {
        const createdPatient = result.payload;
        const createdPatientId =
          createdPatient?.user_id || createdPatient?.id || createdPatient?.original_user_id;

        const refreshPatients = async () => {
          await dispatch(fetchPatients());
          alert("✅ تم إنشاء المريض بنجاح");
          resetFormState("patient");
        };

        if (createdPatientId && Object.keys(optionalPatientFields).length > 0) {
          try {
            await dispatch(
              updatePatient({ user_id: String(createdPatientId), data: optionalPatientFields })
            );
          } catch (error) {
            console.error("❌ خطأ في تحديث البيانات الاختيارية للمريض:", error);
          } finally {
            await refreshPatients();
          }
        } else {
          await refreshPatients();
        }
      } else if (result.type === "accounts/createPatient/rejected") {
        alert(`❌ فشل الإنشاء: ${result.payload}`);
      }
    } catch (err) {
      alert(`❌ خطأ في الإنشاء: ${err.message}`);
    }
  };

  const submitStudent = async () => {
    const userIdCandidate = formData.user_id || formData.id;
    const normalizedUniversityId = normalizeUniversityId(formData.university, universities);

    if (isEditing) {
      if (!userIdCandidate) {
        alert("❌ لا يوجد ID للحساب المحدد للتعديل");
        return;
      }

      const userId = String(userIdCandidate);
      const updatePayload = stripPayload(
        {
          first_name: sanitizeValue(formData.first_name),
          last_name: sanitizeValue(formData.last_name),
          phone_number: sanitizeValue(formData.phone_number),
          address: sanitizeValue(formData.address),
          date_of_birth: sanitizeValue(formData.date_of_birth),
          gender: sanitizeValue(formData.gender),
          profile_picture: sanitizeValue(formData.profile_picture),
          university: normalizedUniversityId,
          student_id: sanitizeValue(formData.student_id),
          year_of_study: sanitizeValue(formData.year_of_study),
          specialization: sanitizeValue(formData.specialization),
        },
        { preserveNull: true }
      );

      try {
        const result = await dispatch(updateStudent({ user_id: userId, data: updatePayload }));
        if (result.type === "accounts/updateStudent/fulfilled") {
          await dispatch(fetchStudents());
          resetFormState("student");
          alert("✅ تم تحديث بيانات الطالب بنجاح");
        } else if (result.type === "accounts/updateStudent/rejected") {
          alert(`❌ فشل التحديث: ${result.payload}`);
        }
      } catch (err) {
        alert(`❌ خطأ في التحديث: ${err.message}`);
      }
      return;
    }

    const createPayload = stripPayload(
      {
        username: formData.username?.trim(),
        email: formData.email?.trim(),
        password: formData.password,
        password_confirm: formData.password_confirm || formData.password,
        first_name: sanitizeValue(formData.first_name),
        last_name: sanitizeValue(formData.last_name),
        university_id: normalizedUniversityId,
        student_id: sanitizeValue(formData.student_id),
        year_of_study: sanitizeValue(formData.year_of_study),
        specialization: sanitizeValue(formData.specialization),
      },
      { preserveNull: false }
    );

    const optionalStudentFields = stripPayload(
      {
        phone_number: sanitizeValue(formData.phone_number),
        address: sanitizeValue(formData.address),
        date_of_birth: sanitizeValue(formData.date_of_birth),
        gender: sanitizeValue(formData.gender),
        profile_picture: sanitizeValue(formData.profile_picture),
        university: normalizedUniversityId,
      },
      { preserveNull: false }
    );

    try {
      const result = await dispatch(createStudent(createPayload));
      if (result.type === "accounts/createStudent/fulfilled") {
        const createdStudent = result.payload;
        const createdStudentId =
          createdStudent?.user_id || createdStudent?.id || createdStudent?.original_user_id;

        const refreshStudents = async () => {
          await dispatch(fetchStudents());
          alert("✅ تم إنشاء الطالب بنجاح");
          resetFormState("student");
        };

        if (createdStudentId && Object.keys(optionalStudentFields).length > 0) {
          try {
            await dispatch(
              updateStudent({ user_id: String(createdStudentId), data: optionalStudentFields })
            );
          } catch (error) {
            console.error("❌ خطأ في تحديث البيانات الاختيارية للطالب:", error);
          } finally {
            await refreshStudents();
          }
        } else {
          await refreshStudents();
        }
      } else if (result.type === "accounts/createStudent/rejected") {
        alert(`❌ فشل الإنشاء: ${result.payload}`);
      }
    } catch (err) {
      alert(`❌ خطأ في الإنشاء: ${err.message}`);
    }
  };

  const submitUniversityAdmin = async () => {
    const userIdCandidate = formData.user_id || formData.id;
    const normalizedUniversityId = normalizeUniversityId(formData.university, universities);

    const baseUpdateFields = {
      first_name: sanitizeValue(formData.first_name),
      last_name: sanitizeValue(formData.last_name),
      phone_number: sanitizeValue(formData.phone_number),
      address: sanitizeValue(formData.address),
      date_of_birth: sanitizeValue(formData.date_of_birth),
      gender: sanitizeValue(formData.gender),
      profile_picture: sanitizeValue(formData.profile_picture),
      university: normalizedUniversityId,
      department: sanitizeValue(formData.department),
      position: sanitizeValue(formData.position),
    };

    if (isEditing) {
      if (!userIdCandidate) {
        alert("❌ لا يوجد ID للحساب المحدد للتعديل");
        return;
      }

      const userId = String(userIdCandidate);
      const updatePayload = stripPayload(baseUpdateFields, { preserveNull: true });

      try {
        const result = await dispatch(updateUniversityAdmin({ user_id: userId, data: updatePayload }));
        if (result.type === "accounts/updateUniversityAdmin/fulfilled") {
          await dispatch(fetchUniversityAdmins());
          resetFormState("university_admin");
          alert("✅ تم تحديث بيانات مدير الجامعة بنجاح");
        } else if (result.type === "accounts/updateUniversityAdmin/rejected") {
          alert(`❌ فشل التحديث: ${result.payload}`);
        }
      } catch (err) {
        alert(`❌ خطأ في التحديث: ${err.message}`);
      }
      return;
    }

    const createPayload = stripPayload(
      {
        username: formData.username?.trim(),
        email: formData.email?.trim(),
        password: formData.password,
        password_confirm: formData.password_confirm || formData.password,
        first_name: sanitizeValue(formData.first_name),
        last_name: sanitizeValue(formData.last_name),
        university_id: normalizedUniversityId,
        department: sanitizeValue(formData.department),
        position: sanitizeValue(formData.position),
      },
      { preserveNull: false }
    );

    const optionalAdminFields = stripPayload(baseUpdateFields, { preserveNull: false });

    try {
      const result = await dispatch(createUniversityAdmin(createPayload));
      if (result.type === "accounts/createUniversityAdmin/fulfilled") {
        const createdAdmin = result.payload;
        const createdAdminId =
          createdAdmin?.user_id || createdAdmin?.id || createdAdmin?.original_user_id;

        const refreshAdmins = async () => {
          await dispatch(fetchUniversityAdmins());
          alert("✅ تم إنشاء مدير الجامعة بنجاح");
          resetFormState("university_admin");
        };

        if (createdAdminId && Object.keys(optionalAdminFields).length > 0) {
          try {
            await dispatch(
              updateUniversityAdmin({ user_id: String(createdAdminId), data: optionalAdminFields })
            );
          } catch (error) {
            console.error("❌ خطأ في تحديث البيانات الاختيارية لمدير الجامعة:", error);
          } finally {
            await refreshAdmins();
          }
        } else {
          await refreshAdmins();
        }
      } else if (result.type === "accounts/createUniversityAdmin/rejected") {
        alert(`❌ فشل الإنشاء: ${result.payload}`);
      }
    } catch (err) {
      alert(`❌ خطأ في الإنشاء: ${err.message}`);
    }
  };

  const submitTechSupport = async () => {
    const userIdCandidate = formData.user_id || formData.id;

    const baseUpdateFields = {
      first_name: sanitizeValue(formData.first_name),
      last_name: sanitizeValue(formData.last_name),
      phone_number: sanitizeValue(formData.phone_number),
      address: sanitizeValue(formData.address),
      date_of_birth: sanitizeValue(formData.date_of_birth),
      gender: sanitizeValue(formData.gender),
      profile_picture: sanitizeValue(formData.profile_picture),
      department: sanitizeValue(formData.department),
      position: sanitizeValue(formData.position),
    };

    if (isEditing) {
      if (!userIdCandidate) {
        alert("❌ لا يوجد ID للحساب المحدد للتعديل");
        return;
      }

      const userId = String(userIdCandidate);
      const updatePayload = stripPayload(baseUpdateFields, { preserveNull: true });

      try {
        const result = await dispatch(updateTechSupport({ user_id: userId, data: updatePayload }));
        if (result.type === "accounts/updateTechSupport/fulfilled") {
          await dispatch(fetchTechSupport());
          resetFormState("tech_support");
          alert("✅ تم تحديث بيانات موظف الدعم التقني بنجاح");
        } else if (result.type === "accounts/updateTechSupport/rejected") {
          alert(`❌ فشل التحديث: ${result.payload}`);
        }
      } catch (err) {
        alert(`❌ خطأ في التحديث: ${err.message}`);
      }
      return;
    }

    const createPayload = stripPayload(
      {
        username: formData.username?.trim(),
        email: formData.email?.trim(),
        password: formData.password,
        password_confirm: formData.password_confirm || formData.password,
        first_name: sanitizeValue(formData.first_name),
        last_name: sanitizeValue(formData.last_name),
        department: sanitizeValue(formData.department),
        position: sanitizeValue(formData.position),
      },
      { preserveNull: false }
    );

    const optionalFields = stripPayload(baseUpdateFields, { preserveNull: false });

    try {
      const result = await dispatch(createTechSupport(createPayload));
      if (result.type === "accounts/createTechSupport/fulfilled") {
        const createdTech = result.payload;
        const createdTechId =
          createdTech?.user_id || createdTech?.id || createdTech?.original_user_id;

        const refreshTech = async () => {
          await dispatch(fetchTechSupport());
          alert("✅ تم إنشاء موظف الدعم التقني بنجاح");
          resetFormState("tech_support");
        };

        if (createdTechId && Object.keys(optionalFields).length > 0) {
          try {
            await dispatch(
              updateTechSupport({ user_id: String(createdTechId), data: optionalFields })
            );
          } catch (error) {
            console.error("❌ خطأ في تحديث البيانات الاختيارية لموظف الدعم:", error);
          } finally {
            await refreshTech();
          }
        } else {
          await refreshTech();
        }
      } else if (result.type === "accounts/createTechSupport/rejected") {
        alert(`❌ فشل الإنشاء: ${result.payload}`);
      }
    } catch (err) {
      alert(`❌ خطأ في الإنشاء: ${err.message}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isEditing && formData.password !== formData.password_confirm) {
      alert("كلمة المرور وتأكيدها غير متطابقين");
      return;
    }

    if (!isEditing) {
      const passwordPolicy = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
      if (!passwordPolicy.test(formData.password || "")) {
        alert("⚠️ كلمة المرور يجب أن لا تقل عن 8 أحرف وتحتوي على حرف كبير ورقم ورمز.");
        return;
      }

      const usernameToCheck = (formData.username || "").trim().toLowerCase();
      const emailToCheck = (formData.email || "").trim().toLowerCase();
      const existingRecords = [
        ...(users || []),
        ...(patients || []),
        ...(students || []),
        ...(universityAdmins || []),
        ...(techSupport || []),
      ];

      const usernameExists = existingRecords.some(
        (record) => (record.username || "").trim().toLowerCase() === usernameToCheck
      );
      if (usernameExists) {
        alert("⚠️ اسم المستخدم مستخدم مسبقاً. يرجى اختيار اسم آخر.");
        return;
      }

      const emailExists = existingRecords.some(
        (record) => (record.email || "").trim().toLowerCase() === emailToCheck
      );
      if (emailExists) {
        alert("⚠️ البريد الإلكتروني مستخدم مسبقاً. يرجى استخدام بريد آخر.");
        return;
      }
    }

    switch (activeRole) {
      case "supervisor":
        submitSupervisor();
        break;
      case "patient":
        submitPatient();
        break;
      case "student":
        submitStudent();
        break;
      case "university_admin":
        submitUniversityAdmin();
        break;
      case "tech_support":
        submitTechSupport();
        break;
      default:
        break;
    }
  };

  const handleEdit = async (user) => {
    const userIdCandidate = user?.user_id ?? user?.id ?? user?.original_user_id;
    if (!userIdCandidate) {
      alert("❌ لا يمكن العثور على معرف المستخدم للتعديل");
      return;
    }

    const userId = String(userIdCandidate);
    if (!uuidRegex.test(userId)) {
      console.warn("⚠️ المعرف ليس UUID، سيتم محاولة الإرسال كما هو:", userId);
    }

    const parseDate = (dateValue) => {
      if (!dateValue) return "";
      return dateValue.includes("T") ? dateValue.split("T")[0] : dateValue;
    };

    if (activeRole === "supervisor") {
      try {
        const result = await dispatch(getAccountDetails(userId));
        let supervisorData = null;
        if (result.type === "accounts/getAccountDetails/fulfilled") {
          supervisorData = result.payload;
        } else {
          supervisorData = user;
        }

        if (!supervisorData) {
          alert("❌ لم يتم العثور على بيانات المشرف للتعديل");
          return;
        }

        const normalizedUniversity = normalizeUniversityId(
          supervisorData.university_id || supervisorData.university,
          universities
        );

        const supervisorForm = {
          ...getInitialFormData("supervisor"),
          id: userId,
          user_id: userId,
          username: supervisorData.username || "",
          email: supervisorData.email || "",
          password: "",
          password_confirm: "",
          first_name: supervisorData.first_name || "",
          last_name: supervisorData.last_name || "",
          department: supervisorData.department || "",
          position: supervisorData.position || "",
          date_of_birth: parseDate(supervisorData.date_of_birth),
          gender: supervisorData.gender || "",
          university: normalizedUniversity || "",
          phone_number: supervisorData.phone_number || "",
          address: supervisorData.address || "",
          license_number: supervisorData.license_number || "",
          profile_picture: supervisorData.profile_picture || "",
        };

        setFormData(supervisorForm);
        setIsEditing(true);
      } catch (error) {
        console.error("❌ خطأ في جلب تفاصيل المشرف:", error);
        alert("❌ خطأ في جلب تفاصيل المشرف");
      }
    } else if (activeRole === "patient") {
      try {
        const result = await dispatch(getPatientDetails(userId));
        let patientData = null;
        if (result.type === "accounts/getPatientDetails/fulfilled") {
          patientData = result.payload;
        } else {
          patientData = user;
        }

        if (!patientData) {
          alert("❌ لم يتم العثور على بيانات المريض");
          return;
        }

        const patientForm = {
          ...getInitialFormData("patient"),
          id: userId,
          user_id: userId,
          username: patientData.username || "",
          email: patientData.email || "",
          password: "",
          password_confirm: "",
          first_name: patientData.first_name || "",
          last_name: patientData.last_name || "",
          phone_number: patientData.phone_number || "",
          address: patientData.address || "",
          date_of_birth: parseDate(patientData.date_of_birth),
          gender: patientData.gender || "",
          profile_picture: patientData.profile_picture || "",
          medical_history: patientData.medical_history || "",
          allergies: patientData.allergies || "",
          medications: patientData.medications || "",
          emergency_contact_name: patientData.emergency_contact_name || "",
          emergency_contact_phone: patientData.emergency_contact_phone || "",
        };

        setFormData(patientForm);
        setIsEditing(true);
      } catch (error) {
        console.error("❌ خطأ في جلب تفاصيل المريض:", error);
        alert("❌ خطأ في جلب تفاصيل المريض");
      }
    } else if (activeRole === "student") {
      try {
        const result = await dispatch(getStudentDetails(userId));
        let studentData = null;
        if (result.type === "accounts/getStudentDetails/fulfilled") {
          studentData = result.payload;
        } else {
          studentData = user;
        }

        if (!studentData) {
          alert("❌ لم يتم العثور على بيانات الطالب");
          return;
        }

        const normalizedUniversity = normalizeUniversityId(
          studentData.university_id || studentData.university,
          universities
        );

        const studentForm = {
          ...getInitialFormData("student"),
          id: userId,
          user_id: userId,
          username: studentData.username || "",
          email: studentData.email || "",
          password: "",
          password_confirm: "",
          first_name: studentData.first_name || "",
          last_name: studentData.last_name || "",
          university: normalizedUniversity || "",
          student_id: studentData.student_id || "",
          year_of_study:
            studentData.year_of_study === null || studentData.year_of_study === undefined
              ? ""
              : String(studentData.year_of_study),
          specialization: studentData.specialization || "",
          phone_number: studentData.phone_number || "",
          address: studentData.address || "",
          date_of_birth: parseDate(studentData.date_of_birth),
          gender: studentData.gender || "",
          profile_picture: studentData.profile_picture || "",
        };

        setFormData(studentForm);
        setIsEditing(true);
      } catch (error) {
        console.error("❌ خطأ في جلب تفاصيل الطالب:", error);
        alert("❌ خطأ في جلب تفاصيل الطالب");
      }
    } else if (activeRole === "university_admin") {
      try {
        const result = await dispatch(getUniversityAdminDetails(userId));
        let adminData = null;
        if (result.type === "accounts/getUniversityAdminDetails/fulfilled") {
          adminData = result.payload;
        } else {
          adminData = user;
        }

        if (!adminData) {
          alert("❌ لم يتم العثور على بيانات مدير الجامعة");
          return;
        }

        const normalizedUniversity = normalizeUniversityId(
          adminData.university_id || adminData.university,
          universities
        );

        const adminForm = {
          ...getInitialFormData("university_admin"),
          id: userId,
          user_id: userId,
          username: adminData.username || "",
          email: adminData.email || "",
          password: "",
          password_confirm: "",
          first_name: adminData.first_name || "",
          last_name: adminData.last_name || "",
          university: normalizedUniversity || "",
          department: adminData.department || "",
          position: adminData.position || "",
          phone_number: adminData.phone_number || "",
          address: adminData.address || "",
          date_of_birth: parseDate(adminData.date_of_birth),
          gender: adminData.gender || "",
          profile_picture: adminData.profile_picture || "",
        };

        setFormData(adminForm);
        setIsEditing(true);
      } catch (error) {
        console.error("❌ خطأ في جلب تفاصيل مدير الجامعة:", error);
        alert("❌ خطأ في جلب تفاصيل مدير الجامعة");
      }
    } else if (activeRole === "tech_support") {
      try {
        const result = await dispatch(getTechSupportDetails(userId));
        let techData = null;
        if (result.type === "accounts/getTechSupportDetails/fulfilled") {
          techData = result.payload;
        } else {
          techData = user;
        }

        if (!techData) {
          alert("❌ لم يتم العثور على بيانات موظف الدعم التقني");
          return;
        }

        const techForm = {
          ...getInitialFormData("tech_support"),
          id: userId,
          user_id: userId,
          username: techData.username || "",
          email: techData.email || "",
          password: "",
          password_confirm: "",
          first_name: techData.first_name || "",
          last_name: techData.last_name || "",
          department: techData.department || "",
          position: techData.position || "",
          phone_number: techData.phone_number || "",
          address: techData.address || "",
          date_of_birth: parseDate(techData.date_of_birth),
          gender: techData.gender || "",
          profile_picture: techData.profile_picture || "",
        };

        setFormData(techForm);
        setIsEditing(true);
      } catch (error) {
        console.error("❌ خطأ في جلب تفاصيل موظف الدعم التقني:", error);
        alert("❌ خطأ في جلب تفاصيل موظف الدعم التقني");
      }
    }
  };

  const handleDelete = (user) => {
    const userIdCandidate = user?.user_id ?? user?.id ?? user?.original_user_id;
    if (!userIdCandidate) {
      alert("❌ لا يمكن العثور على معرف المستخدم للحذف");
      return;
    }

    const userId = String(userIdCandidate);

    let confirmMessage = "هل أنت متأكد من الحذف؟";
    if (activeRole === "supervisor") {
      confirmMessage = "هل أنت متأكد من حذف هذا المشرف؟";
    } else if (activeRole === "patient") {
      confirmMessage = "هل أنت متأكد من حذف هذا المريض؟";
    } else if (activeRole === "student") {
      confirmMessage = "هل أنت متأكد من حذف هذا الطالب؟";
    } else if (activeRole === "university_admin") {
      confirmMessage = "هل أنت متأكد من حذف هذا المدير؟";
    } else if (activeRole === "tech_support") {
      confirmMessage = "هل أنت متأكد من حذف موظف الدعم التقني؟";
    }

    if (confirm(confirmMessage)) {
      if (activeRole === "supervisor") {
        dispatch(deleteAccountAsync(userId)).then(() => {
          dispatch(fetchAccounts());
        });
      } else if (activeRole === "patient") {
        dispatch(deletePatient(userId)).then(() => {
          dispatch(fetchPatients());
        });
      } else if (activeRole === "student") {
        dispatch(deleteStudent(userId)).then(() => {
          dispatch(fetchStudents());
        });
      } else if (activeRole === "university_admin") {
        dispatch(deleteUniversityAdmin(userId)).then(() => {
          dispatch(fetchUniversityAdmins());
        });
      } else if (activeRole === "tech_support") {
        dispatch(deleteTechSupport(userId)).then(() => {
          dispatch(fetchTechSupport());
        });
      }
    }
  };

  const handleCancel = () => {
    resetFormState();
  };

  return {
    activeRole,
    setActiveRole,
    formData,
    setFormData,
    isEditing,
    loading,
    error,
    operationLoading,
    operationError,
    displayedUsers,
    handleChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleCancel,
    roleLabels,
    addActionLabels,
    universities,
    uuidRegex,
  };
}

