import React from 'react'
import { NavLink } from 'react-router-dom'
import { Menu } from 'element-react'

const SidebarNav = () => (
  <Menu className='sidebar-nav'>
    <Menu.Item index='1'>
      <NavLink to='/learning-content'>Learning Content</NavLink>
    </Menu.Item>
    <Menu.Item index='2'>
      <NavLink to='/organizations'>Organizations</NavLink>
    </Menu.Item>
    <Menu.Item index='3'>
      <NavLink to='/digest'>Digest</NavLink>
    </Menu.Item>
    <Menu.Item index='4'>
      <NavLink to='/users'>Users</NavLink>
    </Menu.Item>
    {/* <Menu.Item index="5">
      <NavLink to="/team-content">Team Content</NavLink>
    </Menu.Item> */}
    <Menu.Item index='6'>
      <NavLink to='/skills'>Skills</NavLink>
    </Menu.Item>
    <Menu.Item index='7'>
      <NavLink to='/content-sources'>Sources</NavLink>
    </Menu.Item>
    <Menu.Item index='8'>
      <NavLink to='/skill-categories'>Categories & Frameworks</NavLink>
    </Menu.Item>
    <Menu.Item index='9'>
      <NavLink to='/test'>Notifications</NavLink>
    </Menu.Item>
    <Menu.Item index='10'>
      <NavLink to='/stats'>Stats</NavLink>
    </Menu.Item>
    <Menu.Item index='11'>
      <NavLink to='/roles'>Roles</NavLink>
    </Menu.Item>
    <Menu.Item index='12'>
      <NavLink to='/path-templates'>Path Templates</NavLink>
    </Menu.Item>
    <Menu.Item index='13'>
      <NavLink to='/requests'>Delivery requests</NavLink>
    </Menu.Item>

    <style jsx global>{`
      .sidebar-nav a {
        color: inherit;
        text-decoration: none;
        display: block;
        padding: 0 20px;
      }
      .sidebar-nav a.active {
        color: #20a0ff;
      }
      .sidebar-nav .el-menu-item {
        padding: 0;
      }
    `}</style>
  </Menu>
)

export default SidebarNav
