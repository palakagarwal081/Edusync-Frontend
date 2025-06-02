import axios from "axios";
// import config from '../config';

// Create axios instance with base configuration
const API = axios.create({
  //   baseURL: config.API_BASE_URL,
  baseURL:
    "edusyncbackendapp-epefcafwarh0e7g6.centralindia-01.azurewebsites.net",
  // "http://localhost:5186/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor for adding token and handling requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      // Ensure token is properly formatted
      const formattedToken = token.startsWith("Bearer ")
        ? token
        : `Bearer ${token}`;
      config.headers.Authorization = formattedToken;

      // Add additional headers for CORS
      config.headers["Access-Control-Allow-Origin"] = "*";
      config.headers["Access-Control-Allow-Methods"] =
        "GET, POST, PUT, DELETE, OPTIONS";
      config.headers["Access-Control-Allow-Headers"] =
        "Origin, Content-Type, Accept, Authorization, X-Request-With";
    }

    // Log all requests in detail
    if (config.method === "put" || config.method === "post") {
      console.warn("🌐 API REQUEST DETAILS", {
        method: config.method.toUpperCase(),
        url: config.url,
        headers: config.headers,
        data: config.data,
        hasToken: !!token,
      });

      // Special handling for course updates
      if (config.url.includes("/courses/") && config.method === "put") {
        // Ensure courseContent is properly included in the request
        if (config.data && typeof config.data === "object") {
          // Process courseContent
          const courseContent = config.data.courseContent?.trim() || null;
          config.data = {
            ...config.data,
            courseContent: courseContent,
          };

          // Ensure the content type is set correctly
          config.headers["Content-Type"] = "application/json";

          // Log the processed request data
          console.warn("COURSE UPDATE REQUEST DETAILS", {
            courseId: config.url.split("/courses/")[1],
            requestData: {
              ...config.data,
              courseContent: {
                value: courseContent,
                type: typeof courseContent,
                length: courseContent?.length,
                isNull: courseContent === null,
              },
            },
          });

          // Log the final request body
          console.warn("FINAL REQUEST BODY:", JSON.stringify(config.data));
        }
      }
    }

    return config;
  },
  (error) => {
    console.error("REQUEST ERROR:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling global errors
API.interceptors.response.use(
  (response) => {
    // Log successful responses in detail
    console.warn("API RESPONSE DETAILS", {
      url: response.config.url,
      method: response.config.method,
      status: response.status,
      data: response.data,
    });

    // Special logging for course updates
    if (
      response.config.url.includes("/courses/") &&
      response.config.method === "put"
    ) {
      console.warn("COURSE UPDATE RESPONSE DETAILS", {
        courseId: response.config.url.split("/courses/")[1],
        responseData: {
          ...response.data,
          courseContent: {
            value: response.data?.courseContent,
            type: typeof response.data?.courseContent,
            length: response.data?.courseContent?.length,
            isNull: response.data?.courseContent === null,
          },
        },
      });
    }

    return response;
  },
  async (error) => {
    if (error.response) {
      // Server responded with a status code outside 2xx
      const status = error.response.status;
      const data = error.response.data;

      console.error("API ERROR DETAILS:", {
        status,
        data,
        url: error.config.url,
        method: error.config.method,
        requestData: error.config.data,
      });

      switch (status) {
        case 401:
          console.error("Unauthorized access - redirect to login");
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          localStorage.removeItem("userId");
          localStorage.removeItem("userName");
          window.location.href = "/login";
          break;
        case 403:
          console.error("Forbidden access");
          break;
        case 404:
          console.error("Resource not found");
          break;
        case 500:
          console.error("Server error:", data);
          break;
        default:
          console.error("An error occurred:", error.message);
      }
    } else if (error.request) {
      console.error("No response received from server");
      alert(
        "Unable to connect to the server. Please check if the backend server is running at http://localhost:5186"
      );
    } else {
      console.error("Request setup error:", error.message);
    }

    return Promise.reject(error);
  }
);

// Helper functions for common request types
const apiService = {
  get: async (url, params = {}) => {
    try {
      return await API.get(url, { params });
    } catch (error) {
      console.error(`GET ${url} failed:`, error);
      throw error;
    }
  },
  post: async (url, data, config = {}) => {
    try {
      // Ensure data is properly stringified for JSON
      const processedData = JSON.parse(JSON.stringify(data));
      console.warn("POST REQUEST:", {
        url,
        data: processedData,
      });
      return await API.post(url, processedData, config);
    } catch (error) {
      console.error(`POST ${url} failed:`, error);
      throw error;
    }
  },
  put: async (url, data) => {
    try {
      // Special handling for course updates
      if (url.includes("/courses/")) {
        // Ensure courseContent is properly handled
        const processedData = {
          ...data,
          courseContent: data.courseContent?.trim() || null,
        };

        // Log the processed data
        console.warn("COURSE UPDATE PUT REQUEST:", {
          url,
          originalData: data,
          processedData: {
            ...processedData,
            courseContent: {
              value: processedData.courseContent,
              type: typeof processedData.courseContent,
              isNull: processedData.courseContent === null,
              length: processedData.courseContent?.length,
            },
          },
        });

        // Ensure data is properly stringified for JSON
        const stringifiedData = JSON.stringify(processedData);
        console.warn("STRINGIFIED REQUEST DATA:", stringifiedData);

        return await API.put(url, JSON.parse(stringifiedData));
      }

      // For non-course updates, use standard processing
      const processedData = JSON.parse(JSON.stringify(data));
      console.warn("PUT REQUEST:", {
        url,
        data: processedData,
      });
      return await API.put(url, processedData);
    } catch (error) {
      console.error(`PUT ${url} failed:`, error);
      throw error;
    }
  },
  patch: async (url, data) => {
    try {
      return await API.patch(url, data);
    } catch (error) {
      console.error(`PATCH ${url} failed:`, error);
      throw error;
    }
  },
  delete: async (url) => {
    try {
      return await API.delete(url);
    } catch (error) {
      console.error(`DELETE ${url} failed:`, error);
      throw error;
    }
  },
};

export default apiService;
