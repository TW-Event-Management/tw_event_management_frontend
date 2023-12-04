import React, { useEffect } from "react";
import "./homepage.css";

const HomepageForm = () => {
  return (
    <>
      <div class="container">
        <h1>GloEvents</h1>
        <p>
          Transforming ideas into unforgettable events - your vision, our
          expertise. Elevate your occasions with precision planning and flawless
          execution.
        </p>
        <a href="#">Learn more</a>
      </div>
      <div class="blank"></div>
      <div class="container second">
        <div class="item">
          <div class="img img-first"></div>
          <div class="card">
            <h3>Enchanted Garden Gala</h3>
            <p>
              A whimsical evening in an ethereal setting, filled with magical
              ambiance and captivating performances. Join us for an
              unforgettable night under the stars.
            </p>
            <a href="#">Go to event</a>
          </div>
        </div>
        <div class="item">
          <div class="img img-second"></div>
          <div class="card">
            <h3>Unveiling innovations</h3>
            <p>
              A whimsical evening in an ethereal setting, filled with magical
              ambiance and captivating performances. Join us for an
              unforgettable night under the stars.
            </p>
            <a href="#">Go to event</a>
          </div>
        </div>
        <div class="item">
          <div class="img img-third"></div>
          <div class="card">
            <h3>Harmony & rhytm</h3>
            <p>
              A whimsical evening in an ethereal setting, filled with magical
              ambiance and captivating performances. Join us for an
              unforgettable night under the stars.
            </p>
            <a href="#">Go to event</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomepageForm;
