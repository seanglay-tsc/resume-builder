<template>
  <div class="container">
    <!-- JSON Editor -->
    <div class="editor">
      <div class="editor-header">
        <h2>Raw JSON Input</h2>
        <button class="export-button">Export as PDF</button>
      </div>

      <textarea v-model="rawJson" class="json-input" />

      <div v-if="hasError" class="error-alert">⚠️ Invalid JSON format.</div>
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
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

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
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
  background-color: #f9fafb;
  min-height: 100vh;
}

@media (min-width: 768px) {
  .container {
    flex-direction: row;
  }
}

.editor {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  max-width: 30%;
  width: 100%;
  overflow-y: auto;
  max-height: calc(100vh - 4rem);
}

.preview {
  background: #ffffff;
  color: #000000;
  font-family: "Georgia", serif;
  padding: 2rem;
  max-width: 70%;
  width: 100%;
  border: 1px solid #d1d5db;
  box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  max-height: calc(100vh - 4rem);
}

h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

h2 {
  font-size: 1.25rem;
  color: #555;
  margin-bottom: 1.5rem;
}

h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: 2rem;
  margin-bottom: 0.5rem;
  border-bottom: 1px solid #ccc;
  padding-bottom: 0.25rem;
}

.preview p {
  margin-top: 0.25rem;
  font-size: 0.95rem;
  line-height: 1.5;
  color: #333;
}

.skill-list {
  list-style: none;
  padding-left: 0;
  margin-top: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skill-list li {
  font-size: 0.85rem;
  padding: 0.3rem 0.6rem;
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 3px;
}

.entry {
  margin-bottom: 1rem;
}

.export-button {
  background: #e5e7eb;
  border: none;
  padding: 0.4rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.json-input {
  width: 100%;
  height: 500px;
  font-family: monospace;
  font-size: 0.9rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  resize: vertical;
}

.error-alert {
  margin-top: 1rem;
  color: #b91c1c;
  background-color: #fee2e2;
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 0.9rem;
}
</style>
