import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 28, fontSize: 11, fontFamily: "Helvetica" },
  header: { marginBottom: 12, borderBottom: "1px solid #000", paddingBottom: 8 },
  title: { fontSize: 18, fontWeight: 700 },
  sub: { fontSize: 10, marginTop: 2 },
  section: { marginBottom: 10 },
  sectionTitle: { fontSize: 12, fontWeight: 700, marginBottom: 4 },
  itemTitle: { fontWeight: 700, marginBottom: 2 },
  bullet: { marginBottom: 2 },
});

export function ResumeDocument({ formData, generated }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>{formData.fullName}</Text>
          <Text style={styles.sub}>
            {formData.email} | {formData.phone} | {formData.social.github} | {formData.social.linkedin}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <Text>{generated.resume.summary}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <Text>{generated.resume.skills.join(", ")}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Projects</Text>
          {generated.resume.projects.map((project, index) => (
            <View key={index} style={{ marginBottom: 5 }}>
              <Text style={styles.itemTitle}>{project.title}</Text>
              <Text>{project.techStack}</Text>
              {project.bullets.map((point, i) => (
                <Text key={i} style={styles.bullet}>
                  - {point}
                </Text>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          <Text>{generated.resume.education}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience</Text>
          {generated.resume.experience.length === 0 && <Text>No professional experience added.</Text>}
          {generated.resume.experience.map((experience, index) => (
            <View key={index} style={{ marginBottom: 5 }}>
              <Text style={styles.itemTitle}>
                {experience.role} | {experience.company} ({experience.duration})
              </Text>
              {experience.bullets.map((point, i) => (
                <Text key={i} style={styles.bullet}>
                  - {point}
                </Text>
              ))}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
