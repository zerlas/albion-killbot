import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import {
  faCrown,
  faEarthAsia,
  faGear,
  faLandmarkFlag,
  faRankingStar,
  faSkull,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import screenshot1 from "assets/screenshots/725719324-event.png";
import screenshot2 from "assets/screenshots/725719720-event.png";
import screenshot3 from "assets/screenshots/725747034-event.png";
import screenshot4 from "assets/screenshots/725752704-event.png";
import screenshot5 from "assets/screenshots/725753477-event.png";
import screenshot6 from "assets/screenshots/725754202-event.png";
import Paper from "components/Paper";
import { getServerInviteUrl } from "helpers/discord";
import { Badge, Button, Card, Col, Container, Row } from "react-bootstrap";
import StyledHome from "./styles/Home";

const screenshots = [
  screenshot1,
  screenshot2,
  screenshot3,
  screenshot4,
  screenshot5,
  screenshot6,
];

const features = [
  {
    new: true,
    name: "East Server Support",
    icon: faEarthAsia,
    description: "You can track entities from the new Albion East server.",
  },
  {
    name: "Kills",
    icon: faSkull,
    description:
      "Receive a notification on your discord whenever a kill happens in Albion Online.",
  },
  {
    name: "Battles",
    icon: faLandmarkFlag,
    description:
      "Receive a summary of battles with a link to a more detailed report.",
  },
  {
    name: "Rankings",
    icon: faRankingStar,
    description:
      "A ranking of the most famed killers and victims on a daily basis.",
  },
  {
    name: "Settings",
    icon: faGear,
    description:
      "A full functional dashboard where you can configure and checkout subscription for each server the bot runs.",
  },
  {
    name: "Premium",
    icon: faCrown,
    description:
      "With the premium subscription, you can enable exclusive guild features for your server.",
  },
];

const HomePage = () => {
  const screenshot =
    screenshots[Math.floor(Math.random() * screenshots.length)];

  return (
    <StyledHome>
      <Paper
        elevation={6}
        className="d-flex justify-content-around align-items-center p-4 home-card"
      >
        <img src={screenshot} alt="Screenshot" className="d-none d-md-block" />
        <div className="d-flex flex-column align-items-center">
          <h5 className="p-2 d-flex home-text">
            A Discord bot for displaying kills in Albion Online.
          </h5>
          <div className="p-2">
            <a
              href={getServerInviteUrl()}
              className="navbar-link"
              rel="noreferrer"
            >
              <Button variant="primary">
                <FontAwesomeIcon icon={faDiscord} />
                <div>Invite</div>
              </Button>
            </a>
          </div>
        </div>
      </Paper>
      <Container>
        <h4 className="d-flex justify-content-center p-3 pb-0">Features</h4>
        <Row className="px-2">
          {features.map((feature) => (
            <Col key={feature.name} sm={6} lg={4} className="g-4">
              <Card className="p-2 feature-card">
                <div className="p-4 d-flex justify-content-center">
                  <FontAwesomeIcon icon={feature.icon} size="3x" />
                </div>
                <Card.Title className="d-flex justify-content-center align-items-center">
                  <div className="px-2">{feature.name}</div>
                  {feature.new && <Badge bg="primary">NEW</Badge>}
                </Card.Title>
                <Card.Body className="feature-description">
                  {feature.description}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </StyledHome>
  );
};

export default HomePage;
