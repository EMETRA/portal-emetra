'use client';
import React from 'react';
import { SumateHome, SumateAntecedentes, SumateInfo, SumateInst, SumateUni, SumateHow, SumateConoce, FullPageSnap, SumateInscribete} from '@/components/organisms';


const SumatePage: React.FC = () => {
    const sections = [
        <SumateHome key="home"/>,
        <SumateAntecedentes key="SumateAntecedentes"/>,
        <SumateInfo key="SumateInfo"/>,
        <SumateInst key="SumateInst"/>,
        <SumateUni key="SumateUni"/>,
        <SumateHow key="SumateHow"/>,
        <SumateConoce key="SumateConoce"/>,
        <SumateInscribete key="SumateInscribete"/>
    ]
    return (
        <FullPageSnap sections={sections}
            snapAlign='start'
            snapStopAlways={true}
            withKeyboardNav={true} />
    );
};

export default SumatePage;