// English (base language). Every key here must exist; other languages fall
// back to these values for any key they don't define.
const en = {
  // Brand
  brand: "Crop Disease AI",

  // Navbar
  nav_home: "Home",
  nav_upload: "Upload",
  nav_history: "History",
  nav_dashboard: "Dashboard",
  nav_login: "Login",
  nav_signup: "Sign up",
  nav_logout: "Logout",
  nav_toggleMenu: "Toggle navigation menu",
  language_label: "Select language",

  // Common
  loading: "Loading…",
  back: "Back",
  delete: "Delete",
  print: "Print",
  goToUpload: "Go to Upload",
  showing: "Showing",
  of: "of",
  record: "record",
  records: "records",
  disease: "Disease",
  pest: "Pest",

  // Home
  home_badge: "AI-powered crop health",
  home_title: "Smart Pest & Crop Disease Detection",
  home_subtitle:
    "Upload a crop leaf image and get instant, AI-powered disease detection paired with actionable treatment recommendations.",
  home_getStarted: "Get started",
  home_viewDashboard: "View dashboard",
  home_howTitle: "How it works",
  home_howSubtitle: "From photo to plan in three simple steps.",
  home_step1_title: "Upload leaf image",
  home_step1_desc:
    "Snap or upload a clear photo of the affected crop leaf or pest.",
  home_step2_title: "AI detects the issue",
  home_step2_desc:
    "Our model analyses the image and identifies the disease or pest with a confidence score.",
  home_step3_title: "Get a treatment plan",
  home_step3_desc:
    "Receive tailored organic and chemical recommendations to act fast.",

  // Auth — Login
  login_title: "Welcome back",
  login_subtitle: "Sign in to continue to Crop Disease AI",
  login_email: "Email",
  login_password: "Password",
  login_submit: "Sign in",
  login_submitting: "Signing in…",
  login_noAccount: "Don't have an account?",
  login_createOne: "Create one",
  login_success: "Login successful!",
  login_error: "Invalid credentials!",

  // Auth — Register
  register_title: "Create your account",
  register_subtitle: "Start detecting crop diseases in seconds",
  register_username: "Username",
  register_email: "Email",
  register_password: "Password",
  register_submit: "Create account",
  register_submitting: "Creating account…",
  register_haveAccount: "Already have an account?",
  register_signIn: "Sign in",
  register_success: "Registration successful!",
  register_error: "Registration failed!",

  // Upload
  upload_eyebrow: "Detection",
  upload_title: "Upload crop image",
  upload_description:
    "Upload a clear photo of the affected leaf or pest, choose the analysis type, and let the AI do the rest.",
  upload_step1_title: "1. Choose an image",
  upload_step1_desc: "PNG or JPG of a single leaf or pest works best.",
  upload_clickToUpload: "Click to upload an image",
  upload_dragHere: "or drag a file here",
  upload_step2_title: "2. Select analysis type",
  upload_step2_desc: "Tell the model what to look for.",
  upload_disease_desc: "Leaf / plant disease",
  upload_pest_desc: "Insect / pest damage",
  upload_submit: "Upload & Predict",
  upload_processing: "Processing…",
  upload_preview: "Preview",
  upload_noImage: "No image selected",
  upload_uploaded: "Uploaded",
  upload_imageId: "Image ID",
  upload_imageName: "Image name",
  upload_selectError: "Please select an image",
  upload_success: "Prediction completed successfully!",
  upload_error: "Prediction failed!",

  // Prediction result / detail
  result_eyebrow: "Result",
  result_title: "Prediction result",
  result_newPrediction: "New prediction",
  result_analysisType: "Analysis type",
  result_pestDetection: "Pest detection",
  result_diseasePrediction: "Disease prediction",
  result_confidence: "Confidence",
  result_quality: "Quality",
  result_recommendation: "Recommendation",
  result_recommendationDesc: "Suggested actions based on the detection.",
  result_name: "Name",
  result_severity: "Severity",
  result_descriptionLabel: "Description",
  result_treatment: "Treatment",
  result_organicTreatment: "Organic treatment",
  result_chemicalTreatment: "Chemical treatment",
  result_preventiveMeasures: "Preventive measures",
  result_monitoringActions: "Monitoring actions",
  result_empty_title: "No prediction result available",
  result_empty_desc:
    "Upload an image to run a detection and view its results here.",

  // Detail
  detail_eyebrow: "Record",
  detail_title: "Prediction detail",
  detail_notFound_title: "Prediction not found",
  detail_notFound_desc:
    "This prediction may have been deleted or never existed.",
  detail_backToHistory: "Back to History",
  detail_noRecommendation_title: "No recommendation stored",
  detail_noRecommendation_desc:
    "This prediction has no saved recommendation.",
  detail_deleted: "Prediction deleted",
  detail_deleteFailed: "Failed to delete prediction",
  detail_confirmDelete: "Delete this prediction? This cannot be undone.",

  // History
  history_eyebrow: "Activity",
  history_title: "Prediction history",
  history_description:
    "Search, filter and manage your past pest and disease detections.",
  history_exportCsv: "Export CSV",
  history_searchPlaceholder: "Search prediction or model…",
  history_filterAll: "All",
  history_col_id: "ID",
  history_col_type: "Type",
  history_col_prediction: "Prediction",
  history_col_confidence: "Confidence",
  history_col_model: "Model",
  history_col_date: "Date",
  history_empty_title: "No prediction history yet",
  history_empty_desc:
    "Once you run a detection, your results will appear here.",
  history_noResults_title: "No results match your filters",
  history_noResults_desc: "Try a different search term or filter.",
  history_nothingToExport: "Nothing to export",
  history_exported: "Exported to CSV",
  history_prevPage: "Previous page",
  history_nextPage: "Next page",

  // Dashboard
  dashboard_eyebrow: "Overview",
  dashboard_title: "Analytics dashboard",
  dashboard_description:
    "A snapshot of your detection activity and model performance.",
  dashboard_totalPredictions: "Total Predictions",
  dashboard_mostDetected: "Most Detected Disease",
  dashboard_avgConfidence: "Average Confidence",
  dashboard_trendTitle: "Detections over time",
  dashboard_trendDesc: "Last 14 days",
  dashboard_byType: "By type",
  dashboard_topDetections: "Top detections",
  dashboard_topDetectionsDesc: "Most frequent classes",
  dashboard_noData: "No data yet",

  // Recommendation page
  rec_eyebrow: "Treatment",
  rec_title: "Disease recommendation",
  rec_diseaseLabel: "Disease",
  rec_severitySuffix: "severity",
  rec_empty_title: "No recommendation available",
  rec_empty_desc:
    "Run a detection to generate a tailored treatment recommendation.",
  rec_description: "Description",
  rec_treatment: "Treatment",
  rec_organicTreatment: "Organic Treatment",
  rec_chemicalTreatment: "Chemical Treatment",
  rec_preventiveMeasures: "Preventive Measures",
  rec_monitoringActions: "Monitoring Actions",
};

export default en;
