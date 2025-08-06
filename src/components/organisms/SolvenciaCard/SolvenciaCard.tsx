'use client'

import React, {useState} from "react"
import {CardContainer} from "../../server/atoms/index"
import {Tabs, CardBody} from "../../server/molecules/index"
import {SolvenciaForm, ReciboForm} from "../../molecules/index";


const SolvenciaCard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<"solvencia" | "recibo">("solvencia");

    const tabItems = [
        {id: "solvencia", label: "Imprimir solvencia"},
        {id: "recibo", label: "Imprimir recibo de pago"}
    ];

    return (
        <CardContainer>
            <Tabs items={tabItems} activeId={activeTab} onChange={(id: string) => setActiveTab(id as "solvencia" | "recibo")} />
            <CardBody>
                {activeTab === "solvencia"
                    ? <SolvenciaForm />
                    : <ReciboForm />}
            </CardBody>
        </CardContainer>
    )

}

export default SolvenciaCard;