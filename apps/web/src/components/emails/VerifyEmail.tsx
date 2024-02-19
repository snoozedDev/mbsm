import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface VerifyEmailProps {
  verificationCode?: string;
}

export default function VerifyEmail({
  verificationCode = "123123",
}: VerifyEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{`Your verification code: ${verificationCode}`}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section>
            <Section style={titleSection}>MBSM</Section>
            <Section style={upperSection}>
              <Section style={verificationSection}>
                <Text style={verifyText}>Your verification code:</Text>
                <Text style={codeText}>{verificationCode}</Text>
              </Section>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#000",
  color: "#fff",
};

const container = {
  backgroundColor: "#000",
  padding: "20px",
  margin: "0 auto",
};

const h1 = {
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  marginBottom: "15px",
};

const text = {
  fontSize: "14px",
  margin: "24px 0",
};

const titleSection = {
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "48px",
  fontWeight: "bold",
  display: "flex",
  padding: "20px 0",
  alignItems: "center",
  justifyContent: "center",
};

const upperSection = { padding: "25px 35px" };

const verifyText = {
  ...text,
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  margin: 0,
  textAlign: "center" as const,
};

const codeText = {
  ...text,
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontWeight: "bold",
  fontSize: "36px",
  margin: "10px 0",
  textAlign: "center" as const,
};

const verificationSection = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
