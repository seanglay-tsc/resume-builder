<template>
  <div>
    <div id="g_id_signin" class="google-auth-icon" @click="triggerGoogleSignIn">
      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google">
      <span>Sign in</span>
    </div>

    <div class="container">
      <!-- JSON Editor -->
      <div class="editor">
        <div class="editor-header">
          <h2>Raw JSON Input</h2>
          <button class="export-button">Export as PDF</button>
        </div>

        <textarea v-model="rawJson" class="json-input" />
        <div v-if="hasError" class="error-alert">⚠️ Invalid JSON format.</div>

        <!-- Google Sign-In Button -->
        <div id="g_id_signin" style="margin-top: 1rem;" />
      </div>

      <!-- Resume Preview -->
      <div class="preview">
        <h1>{{ form.name || "Your Name" }}</h1>
        <h2>{{ form.title || "Your Title" }}</h2>

        <section>
          <h3>Summary</h3>
          <p>{{ form.summary || "Your professional summary goes here..." }}</p>
        </section>

        <section>
          <h3>Skills</h3>
          <ul class="skill-list">
            <li v-for="(skill, i) in skillList" :key="i">{{ skill }}</li>
          </ul>
        </section>

        <section>
          <h3>Experience</h3>
          <div v-if="Array.isArray(form.experience)">
            <div v-for="(job, i) in form.experience" :key="i" class="entry">
              <p>
                <strong>{{ job.role || "Role" }}</strong> @
                {{ job.company || "Company" }} ({{ job.years || "Years" }})
              </p>
              <p>{{ job.description || "No description provided." }}</p>
            </div>
          </div>
        </section>

        <section>
          <h3>Education</h3>
          <div v-if="Array.isArray(form.education)">
            <div v-for="(edu, i) in form.education" :key="i" class="entry">
              <p>
                <strong>{{ edu.degree || "Degree" }}</strong> –
                {{ edu.school || "School" }} ({{ edu.years || "Years" }})
              </p>
              <p>{{ edu.description || "No description provided." }}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
const runtimeConfig = useRuntimeConfig();

interface Experience {
  company: string;
  role: string;
  years: string;
  description?: string;
}

interface Education {
  degree: string;
  school: string;
  years: string;
  description?: string;
}

interface Resume {
  name: string;
  title: string;
  summary: string;
  skills: string;
  experience: Experience[];
  education: Education[];
}

const defaultJson: Resume = {
  name: "",
  title: "",
  summary: "",
  skills: "",
  experience: [],
  education: [],
};

const rawJson = ref(JSON.stringify(defaultJson, null, 2));
const form = ref<Resume>({ ...defaultJson });
const hasError = ref(false);

watch(rawJson, (val) => {
  try {
    const parsed = JSON.parse(val) as Resume;
    form.value = parsed;
    hasError.value = false;
  } catch {
    hasError.value = true;
  }
});

const skillList = computed(
  () =>
    form.value.skills
      ?.split(",")
      .map((s) => s.trim())
      .filter(Boolean) || []
);

// Google Sign-In
const clientId = runtimeConfig.public.GOOGLE_CLIENT_ID;

const handleGoogleCredential = (response: any) => {
  const idToken = response.credential;
  console.log("✅ Google ID Token:", idToken);
};

const triggerGoogleSignIn = () => {
  window.google?.accounts.id.prompt();
};

onMounted(() => {
  if (window.google && window.google.accounts) {
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleGoogleCredential,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("g_id_signin"),
      {
        theme: "outline",
        size: "large",
      }
    );
    window.google.accounts.id.prompt();
  }
});
</script>
