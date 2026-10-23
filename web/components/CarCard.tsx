import Image from "next/image";
import { Icon } from "./Icons";
import s from "./CarCard.module.css";

export type Car = {
  src: string;
  alt: string;
  name: string;
  price: string;
  location: string;
  distance: string;
  fuel: string;
  miles: string;
};

/* Listing card exactly as drawn in the redesign (Figma 359:11951): the photo under a dark top/bottom
   gradient with the white save button top right and the result number bottom left; then the name
   and seller icon, the price, a rule, and location / fuel / mileage in three equal columns.
   `saved` fills the bookmark, `rank` shows the number. */
export function CarCard({ car, saved = false, rank, sizes = "304px" }: {
  car: Car; saved?: boolean; rank?: number; sizes?: string;
}) {
  return (
    <article className={s.card}>
      <div className={s.media}>
        <Image src={car.src} alt={car.alt} width={960} height={640} sizes={sizes} />
        <div className={s.overlay}>
          <span className={`${s.save} ${saved ? s.saved : ""}`} data-part="save" role="img" aria-label={saved ? "Saved" : "Not saved"}><Icon name="bookmark" /></span>
          {rank && <span className={s.rank}>{String(rank).padStart(2, "0")}</span>}
        </div>
      </div>
      <div className={s.body}>
        <div className={s.top}>
          <div className={s.nameRow}>
            <p className={s.name}>{car.name}</p>
            <Icon name="user-round" />
          </div>
          <strong className={s.price}>{car.price}</strong>
        </div>
        <hr className={s.rule} />
        <ul className={s.meta}>
          <li><Icon name="map-pin" /><span className={s.loc}>{car.location}<br />({car.distance})</span></li>
          <li><Icon name="fuel" />{car.fuel}</li>
          <li><Icon name="gauge" />{car.miles}</li>
        </ul>
      </div>
    </article>
  );
}
