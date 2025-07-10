// components/Navbar.js
import {Navbar, Nav, Container } from "react-bootstrap";
export default function NavigationBar({ navigation = []  }) {

    return (
        <Navbar expand="lg"  style={{ backgroundColor: 'darkslategray' }}>
            <Container fluid>
                <Navbar.Brand href="/" className="fw-bold" style={{ color: "#45CA25" }}>
                    GREENCAR
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="main-navbar-nav" />
                <Navbar.Collapse id="main-navbar-nav">
                    <Nav className="ms-auto">
                        {navigation.map((item, i) => (
                            <Nav.Link key={i} href={item.url} className="text-light" style={{ color: '#f0f0f0' }}>
                                {item.label}
                            </Nav.Link>
                        ))}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
