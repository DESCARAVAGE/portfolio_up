import React from 'react';
import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeFilledIcon from '@mui/icons-material/HomeFilled';
import { paths } from '../../paths';

export const Page = (): React.JSX.Element => {
  return (
    <>
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column'}}>
      <h1>Une erreur est survenue</h1>
      <p>La page demandée est introuvable.</p>
    <div style ={{display: 'flex', gap: '10px'}}>
        <Button onClick={() => window.history.back()} startIcon={<ArrowBackIcon />}  variant='outlined'>Retour</Button>
        <Button href={paths.home} startIcon={<HomeFilledIcon />} variant='outlined'>Accueil</Button>
    </div>
    </div>
    </>
  );
};
