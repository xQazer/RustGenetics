import Head from 'next/head'
import styles from '../styles/main.module.css'
import { GeneticRow } from '../components/GeneticRow';

// G Y H W X

const redGenes = ['W', 'X'];
const greenGenes = ['G', 'Y', 'H'];
const allGenes = [...greenGenes, ...redGenes];

export default function Main() {

  const [geneticInput, setGeneticInput] = React.useState('');
  const [targetGenetic, setTargetGenetic] = React.useState('');

  const [gentics, setGentics] = React.useState([]);

  const clearGentics = () => {
    setGentics([]);
  }

  const onAddGenetic = (e) => {
    e.preventDefault();

    if(geneticInput.length != 6) return;

    setGentics([...gentics, geneticInput]);
    setGeneticInput('');
  }

  const validateGeneticInput = (e) => {
    const chars = String(e.target.value).toUpperCase().split('');
    if (chars.length > 6) return false;
    if (!chars.every(c => allGenes.includes(c))) return false;
    return true;
  }

  const onGeneticChange = (e) => {

    if(!validateGeneticInput(e)) return;

    setGeneticInput(e.target.value.toUpperCase());
  }

  const onTargetGeneticChange = (e) => {
    if(!validateGeneticInput(e)) return;
    setTargetGenetic(e.target.value.toUpperCase());
  }

  const removeGentic = (index) => () => {
    setGentics(gentics.filter((v,i) => i !== index))
  }

  const countGenes = (gentics) => {
    return gentics.reduce((obj, g) => {
      return {
        ...obj,
        [g]: (obj[g] || 0) + 1
      }
    }, {})
  }

  const evaluateGenesOutcome = (...gentics) => {
    const greenCount = gentics.reduce((obj, g) => {
      if (!greenGenes.includes(g)) return obj;
      return {
        ...obj,
        [g]: (obj[g] || 0) + 1
      }
    }, {})

    const redCount = gentics.reduce((obj, g) => {
      if (!redGenes.includes(g)) return obj;
      return {
        ...obj,
        [g]: (obj[g] || 0) + 1
      }
    }, {});

    const maxRedCount = Math.max(Object.values(redCount));
    const maxGreencount = Math.max(Object.values(greenCount));

    if(maxGreencount <= maxRedCount) {
      return Object.entries(redCount).reduce((result, [g, count]) => {
        if(count < result.count) return result;
        if(count == result.count) return {
          ...result,
          genes: [...result.genes, g]
        }

        return {
          count,
          genes: [g]
        }
      }, {count: 0, genes: []}).genes;
    }

    return Object.entries(greenCount).reduce((result, [g, count]) => {
      if(count < result.count) return result;
      if(count == result.count) return {
        ...result,
        genes: [...result.genes, g]
      }

      return {
        count,
        genes: [g]
      }
    }, {count: 0, genes: []}).genes;
  }

  const getCrossBreeding = () => {
    if(targetGenetic.length != 6) return [];

    let options = [];

    const len6 = Array(6).fill(1);
    const targetOutcome = countGenes(targetGenetic.split(''));

    const genticsGenes = gentics.map(g => g.split(''));

    for (let i = 0; i < gentics.length; i++) {
      for (let x = i; x < gentics.length; x++) {
        for (let y = x; y < gentics.length; y++) {
          for (let z = y; z < gentics.length; z++) {

            const iG = genticsGenes[i];
            const xG = genticsGenes[x];
            const yG = genticsGenes[y];
            const zG = genticsGenes[z];

            const outcome = len6.map((_, i) => evaluateGenesOutcome(iG[i], xG[i], yG[i], zG[i]));

            console.log(i, x, y, z, outcome);

            const outcomeFlat = outcome.reduce((arr, a) => [...arr, ...a], []);
            const outcomeCount = countGenes(outcomeFlat);
            console.log(outcome, outcomeCount, targetOutcome);

            if (Object.entries(targetOutcome).every(([g, count]) => outcomeCount[g] >= count)) {

              const getCrossBreedingGentices = () => {
                if(i == x && i == y && i == z) return [iG];
                if(i == x && i == y) return [iG, zG];
                if(i == x && y == z) return [iG, yG];
                return [iG, xG, yG, zG];
              }

              const crossBreedingGentices = getCrossBreedingGentices();

              if (outcome.every(a => a.length === 0)) return crossBreedingGentices;
              options.push(crossBreedingGentices);
            }
          }
        }
      }
    }

    return options;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Rust Genetics</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>

        <h1 className={styles.title}>
          Rust Genetics
        </h1>

        <div className={styles.flex}>

          <div className={styles.column}>
            <div className={styles.bottom_gutter}>
              <form onSubmit={onAddGenetic}>
                <label className={styles.display_block}>Add genetic</label>
                <input
                  value={geneticInput}
                  onChange={onGeneticChange}
                />
              </form>
              <GeneticRow genetic={geneticInput} />
            </div>
            <div>
              <label className={styles.display_block}>Genetics archive</label>
              {gentics.map((gentic, index) => (
                <div key={index} className={styles.align_center}>
                  <GeneticRow genetic={gentic} />
                  <span className={styles.remove_icon} onClick={removeGentic(index)}>X</span>
                </div>
              ))}
              {gentics.length > 0 && <a className={styles.action_a} onClick={clearGentics}>Clear all</a>}
            </div>
          </div>

          <div className={styles.column}>
            <div className={styles.bottom_gutter}>
              <label className={styles.display_block}>Target genetic</label>
              <input
                value={targetGenetic}
                onChange={onTargetGeneticChange}
                />
              <GeneticRow genetic={targetGenetic} />
            </div>
            <div>
            <label className={styles.display_block}>Cross breeding</label>
              {getCrossBreeding().map((gentics, index) => (
                <div key={gentics.join('')} className={styles.bottom_gutter}>
                  {gentics.map((gentic, index) => (
                    <div key={index} className={styles.align_center}>
                      <GeneticRow genetic={gentic.join('')} />
                    </div>
                  ))
                  }
                </div>
              ))}
            </div>
          </div>
        </div>



      </main>

      <footer className={styles.footer}>
        Powered by Qazer
      </footer>
    </div>
  )
}

export async function getStaticProps() {
  return {
    props: {}
  }
}
