import React, { useRef } from 'react';
import { StandaloneSearchBox } from '@react-google-maps/api';

interface AddressAutocompleteProps {
  label?: string;
  value: {
    location: string;
    address: string;
    lat: number | null;
    lng: number | null;
  };
  onSelect: (value: {
    location: string;
    address: string;
    lat: number | null;
    lng: number | null;
  }) => void;
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({ label = 'Location', value, onSelect }) => {
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handlePlacesChanged = () => {
    if (!searchBoxRef.current) return;

    const places = searchBoxRef.current.getPlaces();
    if (!places || places.length === 0) return;

    const place = places[0];
    const location = place.name || '';
    const address = place.formatted_address || '';
    const lat = place.geometry?.location?.lat() || null;
    const lng = place.geometry?.location?.lng() || null;

    onSelect({ location, address, lat, lng });

    if (inputRef.current) inputRef.current.value = `${location} - ${address}`;
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label} *</label>
      <StandaloneSearchBox
        onLoad={(ref) => (searchBoxRef.current = ref)}
        onPlacesChanged={handlePlacesChanged}
      >
        <input
          ref={inputRef}
          type="text"
          defaultValue={value.location ? `${value.location} - ${value.address}` : ''}
          placeholder="Start typing a location..."
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-xs p-2 focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </StandaloneSearchBox>
    </div>
  );
};

export default AddressAutocomplete;
