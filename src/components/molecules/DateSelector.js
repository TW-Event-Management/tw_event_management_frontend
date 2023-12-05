import React, { useState } from 'react';
import DateDisplay from '../atoms/DateDisplay';
import '../atoms/date-style.css';
import EventList from '../molecules/EventList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const DateSelector = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [transition, setTransition] = useState(false);

  const handlePreviousDay = () => {
    const currentDate = new Date();
    const newDate = new Date(selectedDate);

    // Check if newDate is not older than the current date
    if (newDate >= currentDate) {
      newDate.setDate(selectedDate.getDate() - 1);
      setTransition(true);
      setTimeout(() => {
        setSelectedDate(newDate);
        setTransition(false);
      }, 300);
    }
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 1);
    setTransition(true);
    setTimeout(() => {
      setSelectedDate(newDate);
      setTransition(false);
    }, 300);
  };

  const getPreviewDate = (date, offset) => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + offset);
    
    const options = {
      month: 'long',
      day: 'numeric',
    };
  
    const formattedDate = newDate.toLocaleString('en-US', options);
  
    return formattedDate;
  };

  const isPreviousDisabled = () => {
    const currentDate = new Date();
    return selectedDate <= currentDate;
  };

  const previewOffsets = [0, 1, 2, 4, 5];
  const categories = ['All', 'Category1', 'Category2', 'Category3', 'Category4'];

  return (
    <div className='container'>
      <div className={`date-preview ${transition ? 'transition' : ''}`}>
        <button onClick={handlePreviousDay} className='leftButton button-with-bg' disabled={isPreviousDisabled()}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        {previewOffsets.map((offset, index) => (
          <div key={index} className={index === 0 ? 'active' : ''}>
            <p>{getPreviewDate(selectedDate, offset)}</p>
            <p>{offset}</p>
          </div>
        ))}
        <button onClick={handleNextDay} className='rightButton button-with-bg'>
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
      <div className='categories-container'>
        {categories.map((category, index) => (
          <div key={index} className='category-bubble'>
            {category}
          </div>
        ))}
      </div>
      <EventList selectedDate={selectedDate} />
    </div>
  );
};

export default DateSelector;