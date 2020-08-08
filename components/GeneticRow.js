import React from 'react';
import styles from '../styles/main.module.css'
import clsx from 'clsx';

export function GeneticRow({ genetic }) {

  return (
    <div className={styles.genetic_row}>
      {Array(6).fill(1).map((_, index) => {
        const char = genetic.charAt(index);
        const isRed = ['W', 'X'].includes(char);

        return (
          <div className={clsx(styles.genetic, isRed && styles.genetic_red, !char && styles.genetic_gray)}>
            {char || '?'}
          </div>
        )
      })}
    </div>
  )
}


