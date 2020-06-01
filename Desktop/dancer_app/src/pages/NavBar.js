import React, {useState} from 'react';
import {
  Collapse, 
  Nav,
  Navbar,
  NavbarToggler,
  NavItem,
  NavbarBrand,
  NavLink
} from "reactstrap";


const Menu = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <Navbar style={{backgroundColor: "rgba(0,0,0,0.5)" }} light expand="md" fixed="top">
      <NavbarBrand href="/" style={{'marginLeft':'auto', 'marginRight':'auto', 'color':'#fff'}}>Home</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink href="/map" style={{'color':'#fff'}}>Map</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/class" style={{'color':'#fff'}}>Class</NavLink>
            </NavItem>
          </Nav>
        </Collapse> 
    </Navbar>
  );
}

export default Menu;