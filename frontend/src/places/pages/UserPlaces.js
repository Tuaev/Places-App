import React from 'react';
import { useParams } from 'react-router-dom';

import PlaceList from '../components/PlaceList';

const DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world!',
    imageUrl:
      'https://images.pexels.com/photos/2404949/pexels-photo-2404949.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
    address: '20 W 34th St, New York, NY 10001, United States',
    location: {
      lat: '40.7485644',
      lng: '-73.9867614',
    },
    creator: 'u1',
  },
  {
    id: 'p2',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world!',
    imageUrl:
      'https://images.pexels.com/photos/2404949/pexels-photo-2404949.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
    address: '20 W 34th St, New York, NY 10001, United States',
    location: {
      lat: '40.7485644',
      lng: '-73.9867614',
    },
    creator: 'u2',
  },
];

const UserPlaces = (props) => {
  const { userId } = useParams();

  const loadedPlaces = DUMMY_PLACES.filter((place) => place.creator === userId);
  return <PlaceList items={loadedPlaces} />;
};

export default UserPlaces;
