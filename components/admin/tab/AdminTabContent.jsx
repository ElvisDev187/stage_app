import React from 'react'
import HomeFeed from './HomeFeed'
import UsersList from './UserList'
import ReportsList from './ReportsList'
import BlockList from './BlockList'
import CreateUser from './CreateUser'

const AdminTabContent = ({activeTab}) => {
  return (
    <>
      {activeTab == "home"? <HomeFeed/>: null}
      {activeTab == "users"? <UsersList/>: null}
      {activeTab == "reports"? <ReportsList/>: null}
      {activeTab == "block"? <BlockList/>: null}
      {activeTab == "new"? <CreateUser/>: null}
    </>
  )
}

export default AdminTabContent
