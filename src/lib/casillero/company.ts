"use client";

import { useEffect } from "react";
import { create } from "zustand";

/**
 * Cambia este valor para ver cada menú de empresa:
 * `ninguno`, `solicitud`, `invitaciones`, `dueno`, `miembro`.
 */
export const COMPANY_SCENARIO = "dueno" as const;

/** Si es true, las lecturas fallan para revisar el estado de error. */
export const COMPANY_FAIL_READS = false;

export type CompanyScenario = "ninguno" | "solicitud" | "invitaciones" | "dueno" | "miembro";

export type CompanyRole = "PROPIETARIO" | "MIEMBRO" | "ADMINISTRADOR";

export type RegistrationStatus = "PENDIENTE" | "APROBADA" | "RECHAZADA";

export type CompanySummary = {
    id: string;
    nit: string;
    razonSocial: string;
    rol: "PROPIETARIO" | "MIEMBRO";
};

export type CompanyDetail = CompanySummary & {
    estado: "ACTIVA";
};

export type CompanyRegistrationRequest = {
    id: string;
    nit: string;
    razonSocial: string;
    estado: RegistrationStatus;
    motivoRechazo?: string;
    creadaEn: string;
    actualizadaEn: string;
    documento: { nombre: string };
};

export type CompanyMember = {
    id: string;
    nombre: string;
    correo: string;
    roles: string[];
};

export type CompanyInvitation = {
    id: string;
    empresa: { razonSocial: string; nit: string };
    rol: string;
    estado: "PENDIENTE";
    invitacionEn: string;
};

export type SentInvitation = {
    id: string;
    correo: string;
    rol: string;
    estado: "VIGENTE";
};

export type CompanyAccess = {
    company: CompanySummary | null;
    request: CompanyRegistrationRequest | null;
    invitations: CompanyInvitation[];
};

export type CompanyMenuItem = {
    label: string;
    href: string;
};

type Memory = {
    company: CompanyDetail | null;
    request: CompanyRegistrationRequest | null;
    invitations: CompanyInvitation[];
    members: CompanyMember[];
    sentInvitations: SentInvitation[];
};

const CURRENT_USER = {
    id: "me",
    nombre: "Daniel Esteban Morales Urizar",
    correo: "daniel@muniguate.com",
};

const WAIT_MS = 500;

export class CompanyClientError extends Error {
    readonly status: number;

    constructor(status: number, message: string) {
        super(message);
        this.name = "CompanyClientError";
        this.status = status;
    }
}

const COMPANY_OPERATIONS_MENU: CompanyMenuItem[] = [
    { label: "Listado de placas", href: "/casillero/dashboard/placas" },
    { label: "Mis remisiones", href: "/casillero/dashboard/multas" },
    { label: "Historial", href: "/casillero/dashboard/historial" },
    { label: "Buzón", href: "/casillero/buzon" },
    { label: "Mis solicitudes", href: "/casillero/dashboard/solicitudes" },
];

function wait() {
    return new Promise((resolve) => setTimeout(resolve, WAIT_MS));
}

function seed(scenario: CompanyScenario): Memory {
    if (scenario === "solicitud") {
        return {
            company: null,
            request: {
                id: "req-1",
                nit: "87654321",
                razonSocial: "Logística Centro, S.A.",
                estado: "PENDIENTE",
                creadaEn: "2026-10-02T14:30:00.000Z",
                actualizadaEn: "2026-10-02T14:30:00.000Z",
                documento: { nombre: "representacion-legal.pdf" },
            },
            invitations: [],
            members: [],
            sentInvitations: [],
        };
    }

    if (scenario === "invitaciones") {
        return {
            company: null,
            request: null,
            invitations: [
                {
                    id: "inv-1",
                    empresa: { razonSocial: "Distribuidora Norte, S.A.", nit: "44556677" },
                    rol: "MIEMBRO",
                    estado: "PENDIENTE",
                    invitacionEn: "2026-10-20T09:00:00.000Z",
                },
            ],
            members: [],
            sentInvitations: [],
        };
    }

    const owned = scenario === "dueno";
    if (owned || scenario === "miembro") {
        return {
            company: {
                id: "com-1",
                nit: "12345678",
                razonSocial: "Transportes Aurora, S.A.",
                rol: owned ? "PROPIETARIO" : "MIEMBRO",
                estado: "ACTIVA",
            },
            request: null,
            invitations: [],
            members: [
                {
                    id: "mem-owner",
                    nombre: owned ? CURRENT_USER.nombre : "María López García",
                    correo: owned ? CURRENT_USER.correo : "maria@transportes-aurora.com",
                    roles: ["PROPIETARIO"],
                },
                {
                    id: owned ? "mem-2" : CURRENT_USER.id,
                    nombre: owned ? "Ana López" : CURRENT_USER.nombre,
                    correo: owned ? "ana@muniguate.com" : CURRENT_USER.correo,
                    roles: ["MIEMBRO"],
                },
            ],
            sentInvitations: owned
                ? [{ id: "sent-1", correo: "invitado@muniguate.com", rol: "MIEMBRO", estado: "VIGENTE" }]
                : [],
        };
    }

    return {
        company: null,
        request: null,
        invitations: [],
        members: [],
        sentInvitations: [],
    };
}

let memory = seed(COMPANY_SCENARIO);

function snapshot(): CompanyAccess {
    return {
        company: memory.company
            ? {
                id: memory.company.id,
                nit: memory.company.nit,
                razonSocial: memory.company.razonSocial,
                rol: memory.company.rol,
            }
            : null,
        request: memory.request ? { ...memory.request, documento: { ...memory.request.documento } } : null,
        invitations: memory.invitations.map((invitation) => ({
            ...invitation,
            empresa: { ...invitation.empresa },
        })),
    };
}

function assertReads() {
    if (COMPANY_FAIL_READS) {
        throw new CompanyClientError(503, "No se pudo cargar la información. Inténtalo de nuevo.");
    }
}

async function read<T>(value: T): Promise<T> {
    await wait();
    assertReads();
    return value;
}

function requireCompany() {
    if (!memory.company) {
        throw new CompanyClientError(404, "No tienes una empresa activa.");
    }
    return memory.company;
}

function requireOwner() {
    const company = requireCompany();
    if (company.rol !== "PROPIETARIO") {
        throw new CompanyClientError(403, "No tienes autorización para administrar los miembros.");
    }
    return company;
}

function publish() {
    useCompanyAccessStore.setState({
        status: "ready",
        access: snapshot(),
        errorMessage: "",
    });
}

type AccessStatus = "idle" | "loading" | "ready" | "error";

type CompanyAccessStore = {
    status: AccessStatus;
    access: CompanyAccess;
    errorMessage: string;
    load: () => Promise<CompanyAccess>;
    refresh: () => Promise<CompanyAccess>;
};

let loadingAccess: Promise<CompanyAccess> | null = null;

export const useCompanyAccessStore = create<CompanyAccessStore>((set, get) => ({
    status: "idle",
    access: snapshot(),
    errorMessage: "",
    load: () => {
        if (loadingAccess) {
            return loadingAccess;
        }
        if (get().status === "ready") {
            return Promise.resolve(get().access);
        }

        loadingAccess = (async () => {
            set({ status: "loading", errorMessage: "" });
            try {
                const access = await read(snapshot());
                set({ status: "ready", access });
                return access;
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "No se pudo cargar la información.";
                set({ status: "error", errorMessage });
                throw error;
            } finally {
                loadingAccess = null;
            }
        })();

        return loadingAccess;
    },
    refresh: async () => {
        const access = snapshot();
        set({ status: "ready", access, errorMessage: "" });
        return access;
    },
}));

export function useCompanyAccess() {
    const status = useCompanyAccessStore((state) => state.status);
    const access = useCompanyAccessStore((state) => state.access);
    const errorMessage = useCompanyAccessStore((state) => state.errorMessage);
    const load = useCompanyAccessStore((state) => state.load);

    useEffect(() => {
        if (status === "idle") {
            void load();
        }
    }, [status, load]);

    return { status, access, errorMessage, load };
}

export function companyMenuItems(access: CompanyAccess): CompanyMenuItem[] {
    if (access.company) {
        const items = [
            ...COMPANY_OPERATIONS_MENU,
            { label: "Mi empresa", href: "/casillero/empresa" },
        ];
        if (access.company.rol === "PROPIETARIO") {
            items.push({ label: "Gestión de empleados", href: "/casillero/employee-management" });
        }
        return items;
    }

    if (!access.request && access.invitations.length === 0) {
        return [{ label: "Solicitar empresa", href: "/casillero/empresa/solicitud" }];
    }

    const items: CompanyMenuItem[] = [];
    if (access.request) {
        items.push({ label: "Mi solicitud", href: "/casillero/empresa/solicitud" });
    }
    if (access.invitations.length > 0) {
        items.push({ label: "Invitaciones", href: "/casillero/empresa/invitaciones" });
    }
    return items;
}

export function companyHomePath(access: CompanyAccess) {
    return companyMenuItems(access)[0]?.href ?? "/casillero/empresa/solicitud";
}

export function canOpenCompanySummary(access: CompanyAccess) {
    return Boolean(access.company);
}

export function canManageMembers(access: CompanyAccess) {
    return access.company?.rol === "PROPIETARIO";
}

export function canOpenRequest(access: CompanyAccess) {
    return !access.company;
}

export function canOpenInvitations(access: CompanyAccess) {
    return !access.company && access.invitations.length > 0;
}

export async function getCompanyAccess() {
    return read(snapshot());
}

export async function getCompanyRegistrationRequest(id: string) {
    const request = await read(memory.request);
    if (!request || request.id !== id) {
        throw new CompanyClientError(404, "No se encontró la solicitud.");
    }
    return request;
}

export async function createCompanyRegistrationRequest(input: {
    nit: string;
    razonSocial: string;
    documentoNombre: string;
}) {
    await wait();
    if (memory.company) {
        throw new CompanyClientError(409, "Ya perteneces a una empresa.");
    }
    if (memory.request) {
        throw new CompanyClientError(409, "Ya tienes una solicitud de registro.");
    }

    const now = new Date().toISOString();
    memory = {
        ...memory,
        request: {
            id: `req-${Date.now()}`,
            nit: input.nit,
            razonSocial: input.razonSocial,
            estado: "PENDIENTE",
            creadaEn: now,
            actualizadaEn: now,
            documento: { nombre: input.documentoNombre },
        },
    };
    publish();
    return memory.request;
}

export async function getCompanies() {
    const access = await read(snapshot());
    return access.company ? [access.company] : [];
}

export async function getCompany(id: string) {
    const company = await read(memory.company);
    if (!company || company.id !== id) {
        throw new CompanyClientError(404, "No se encontró la empresa.");
    }
    return company;
}

export async function getCompanyMembers(companyId: string) {
    requireCompany();
    if (memory.company?.id !== companyId) {
        throw new CompanyClientError(404, "No se encontró la empresa.");
    }
    return read(memory.members.map((member) => ({ ...member, roles: [...member.roles] })));
}

export async function createCompanyInvitation(companyId: string, input: { correo: string; rol: string }) {
    await wait();
    const company = requireOwner();
    if (company.id !== companyId) {
        throw new CompanyClientError(404, "No se encontró la empresa.");
    }

    const correo = input.correo.trim().toLowerCase();
    const exists = memory.sentInvitations.some(
        (invitation) => invitation.estado === "VIGENTE" && invitation.correo === correo
    );
    if (exists) {
        throw new CompanyClientError(409, "Ya existe una invitación vigente para este correo.");
    }

    const invitation: SentInvitation = {
        id: `sent-${Date.now()}`,
        correo,
        rol: input.rol,
        estado: "VIGENTE",
    };
    memory = {
        ...memory,
        sentInvitations: [...memory.sentInvitations, invitation],
    };
    return invitation;
}

export async function getMyCompanyInvitations() {
    return read(snapshot().invitations);
}

export async function acceptCompanyInvitation(id: string) {
    await wait();
    if (memory.company) {
        throw new CompanyClientError(409, "Ya perteneces a una empresa.");
    }
    const invitation = memory.invitations.find((item) => item.id === id);
    if (!invitation) {
        throw new CompanyClientError(404, "No se encontró la invitación.");
    }

    memory = {
        company: {
            id: `com-${Date.now()}`,
            nit: invitation.empresa.nit,
            razonSocial: invitation.empresa.razonSocial,
            rol: "MIEMBRO",
            estado: "ACTIVA",
        },
        request: null,
        invitations: [],
        sentInvitations: [],
        members: [
            {
                id: "mem-owner",
                nombre: "Carlos Méndez",
                correo: "carlos@empresa.com",
                roles: ["PROPIETARIO"],
            },
            {
                id: CURRENT_USER.id,
                nombre: CURRENT_USER.nombre,
                correo: CURRENT_USER.correo,
                roles: [invitation.rol],
            },
        ],
    };
    publish();
    return memory.company;
}

export async function rejectCompanyInvitation(id: string) {
    await wait();
    const invitation = memory.invitations.find((item) => item.id === id);
    if (!invitation) {
        throw new CompanyClientError(404, "No se encontró la invitación.");
    }
    memory = {
        ...memory,
        invitations: memory.invitations.filter((item) => item.id !== id),
    };
    publish();
    return { id, estado: "RECHAZADA" as const };
}
export async function updateMemberRoles(companyId: string, memberId: string, roles: string[]) {
    await wait();
    const company = requireOwner();
    if (company.id !== companyId) {
        throw new CompanyClientError(404, "No se encontró la empresa.");
    }
    const member = memory.members.find((item) => item.id === memberId);
    if (!member) {
        throw new CompanyClientError(404, "No se encontró el miembro.");
    }
    if (member.roles.includes("PROPIETARIO")) {
        throw new CompanyClientError(403, "No puedes cambiar el rol del propietario.");
    }

    memory = {
        ...memory,
        members: memory.members.map((item) => (
            item.id === memberId ? { ...item, roles: [...roles] } : item
        )),
    };
    return memory.members.find((item) => item.id === memberId)!;
}

