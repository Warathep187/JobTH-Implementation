import { gql } from "@apollo/client";

const SEARCH = gql`
  query Search($input: SearchInput) {
    search(input: $input) {
      _id
      _index
      _score
      _source {
        company {
          companyName
          _id
          image {
            url
          }
        }
        createdAt
        location {
          district
          province
        }
        position
        salary {
          max
          min
        }
        tags
      }
    }
  }
`;

export default { SEARCH };
