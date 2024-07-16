import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export const TwitterWelcomeEmail = ({ username }: { username: string }) => (
  <Html>
    <Head />
    <Preview>Welcome to Twitter! Let's get you started.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Img
            src={
              "https://cdn.mos.cms.futurecdn.net/z3bn6deaxmrjmQHNEkpcZE-970-80.jpg.webp"
            }
            width="190"
            height="100"
            alt="Twitter"
          />
          <Text style={bold}>Hi {username}</Text>
          <Hr style={hr} />
          <Text style={paragraph}>
            Welcome to Twitter! We're excited to have you on board.
          </Text>
          <Text style={paragraph}>
            Twitter is where the world comes to share ideas, news, and connect
            with others in real-time. Start exploring your interests and
            connecting with people.
          </Text>
          <Button style={button} href="https://twitter.com/login">
            Post some tweets
          </Button>
          <Hr style={hr} />
          <Text style={paragraph}>
            Here are some resources to help you get started:
          </Text>
          <Text style={paragraph}>
            - Learn the basics with our{" "}
            <Link
              style={anchor}
              href="https://help.twitter.com/en/twitter-guide"
            >
              Twitter Guide
            </Link>
            .
          </Text>
          <Text style={paragraph}>
            - Customize your profile by following this{" "}
            <Link
              style={anchor}
              href="https://help.twitter.com/en/managing-your-account/how-to-customize-your-profile"
            >
              guide
            </Link>
            .
          </Text>
          <Text style={paragraph}>
            - Get tips on how to Tweet effectively from our{" "}
            <Link
              style={anchor}
              href="https://help.twitter.com/en/using-twitter/twitter-tips-for-new-users"
            >
              tips for new users
            </Link>
            .
          </Text>
          <Text style={paragraph}>
            If you need any assistance, visit our{" "}
            <Link style={anchor} href="https://help.twitter.com/">
              Help Center
            </Link>
            .
          </Text>
          <Text style={paragraph}>— The Twitter team</Text>
          <Hr style={hr} />
          <Text style={footer}>
            Twitter, Inc. 1355 Market Street, Suite 900, San Francisco, CA 94103
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default TwitterWelcomeEmail;

const main = {
  backgroundColor: "#f0f8ff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const box = {
  textAlign: "center" as const,
  padding: "0 48px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const paragraph = {
  color: "#14171a",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
};

const bold = {
  fontWeight: "bold",
  fontSize: "20px",
  lineHeight: "24px",
};
const anchor = {
  color: "#1da1f2",
};

const button = {
  backgroundColor: "#1da1f2",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
  padding: "10px",
};

const footer = {
  color: "#657786",
  fontSize: "12px",
  lineHeight: "16px",
};
