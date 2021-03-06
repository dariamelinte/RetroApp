import gql from 'graphql-tag'

export const GET_USER_INFO = gql`
  query getUserInfo($userId: String) {
    getUserInfo(userId: $userId) {
      _id
      email
      profile {
        firstName
        lastName
        fullName
        categoryIds
        avatarId
        avatar {
          path
          fullPath
        }
      }
      followingCategories {
        _id
        name
        photo {
          fullPath
          path
        }
      }
      ownedEvents {
        _id
        title
        startDate
        location {
          addressName
        }
        photo {
          path
          fullPath
        }
      }
      participatingEvents {
        _id
        title
        startDate
        location {
          addressName
        }
        photo {
          path
          fullPath
        }
      }
    }
  }
`
