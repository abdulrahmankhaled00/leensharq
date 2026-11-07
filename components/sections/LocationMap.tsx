interface LocationMapProps {
  embedUrl: string;
  title: string;
}

/** Responsive, lazy-loaded keyless Google Maps embed. */
export function LocationMap({ embedUrl, title }: LocationMapProps) {
  return (
    <div className="nv-map">
      <iframe src={embedUrl} title={title} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
    </div>
  );
}
