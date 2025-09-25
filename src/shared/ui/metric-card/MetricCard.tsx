import React from 'react';
import styles from './MetricCard.module.css';

// Define the type for the change indicator for better type safety.
type ChangeType = 'positive' | 'negative';

// Define the props interface for the component.
interface MetricCardProps {
  /**
   * The icon to be displayed at the top of the card.
   * Using React.ReactNode allows for SVG components, images, or even simple strings.
   */
  icon: React.ReactNode;
  /**
   * The title of the metric card (e.g., "Total Students").
   */
  title: string;
  /**
   * The main value of the metric. Can be a number or a formatted string.
   */
  value: string | number;
  /**
   * A string describing the change in the metric (e.g., "+5% this month").
   */
  change: string;
  /**
   * The type of change, which determines the color of the change text.
   */
  changeType: ChangeType;
}

/**
 * A reusable card component to display a key metric with an icon, title, value, and change indicator.
 * It's designed to be accessible and responsive.
 */
const MetricCard: React.FC<MetricCardProps> = ({ icon, title, value, change, changeType }) => {
  // Combine CSS classes using template literals for readability.
  // The change text class is conditionally applied based on the changeType prop.
  const changeClasses = `${styles.change} ${styles[changeType]}`;
  const uniqueId = title.replace(/\s+/g, '-').toLowerCase();

  return (
    <article
      className={styles.card}
      aria-labelledby={`metric-title-${uniqueId}`}
      aria-describedby={`metric-value-${uniqueId}`}
    >
      <header className={styles.header}>
        <div className={styles.iconWrapper} aria-hidden="true">
          {icon}
        </div>
        <h3 id={`metric-title-${uniqueId}`} className={styles.title}>
          {title}
        </h3>
      </header>
      <div className={styles.content}>
        <p id={`metric-value-${uniqueId}`} className={styles.value}>
          {value}
        </p>
        <p className={changeClasses}>
          {change}
        </p>
      </div>
    </article>
  );
};

export default React.memo(MetricCard);
