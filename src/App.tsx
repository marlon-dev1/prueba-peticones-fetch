// @ts-nocheck
import { useEffect, useState } from 'react';
import trash from './assets/trash.svg';
import avatar from './assets/avatar.svg';
import pen from './assets/pen.svg';
import read from './assets/read.svg';
import { customFetch } from './utils/customFetch';

const App = () => {
    const [searchId, setSearchId] = useState('');
    const [data, setData] = useState({});
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(false);

    useEffect(() => {
        customFetch('https://dummyapi.io/data/v1/user?limit=10').then((data) => {
            setData(data);
            setUsers(data.data);
        });
    }, []);

    useEffect(() => {
        setError(false);
        const handler = setTimeout(() => {
            if (searchId) {
                customFetch(`https://dummyapi.io/data/v1/user/${searchId}`).then((data) => {
                    if (!data.error) return setUsers([data]);

                    setError(true);
                });
            } else {
                customFetch('https://dummyapi.io/data/v1/user?limit=10').then((data) => {
                    setData(data);
                    setUsers(data.data);
                });
            }
        }, 250);

        return () => clearTimeout(handler);
    }, [searchId]);

    const getUserPerPage = (numberPage: number) => {
        customFetch(`https://dummyapi.io/data/v1/user?limit=10&page=${numberPage}`).then((data) => {
            setData(data);
            setUsers(data.data);
        });
    };

    const paginator = () => {
        const pages = Math.ceil(data.total / data.limit);
        const element = [];

        for (let index = 0; index < pages; index++) {
            element.push(
                <button
                    key={index}
                    onClick={() => getUserPerPage(index)}
                    className={`cursor-pointer px-3 py-1 text-gray-500 hover:text-gray-700 ${
                        data.page === index ? 'text-xl font-bold' : ''
                    }`}>
                    {index + 1}
                </button>
            );
        }

        return element;
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="bg-teal-700 text-white p-4 flex justify-between items-center">
                <h1 className="text-xl font-medium">
                    Módulo de Consulta y Registro de Usuarios al Sistema
                </h1>
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <img src={avatar} alt="Avatar" className="w-6 h-6" />
                </div>
            </header>

            {/* Search and Create Section */}
            <div className="max-w-6xl mx-auto p-6">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <input
                            type="text"
                            placeholder="Id a buscar"
                            className="border rounded px-4 py-2 w-80"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                        />
                        {error && (
                            <p className="text-red-500">
                                El usuario con el id {`<${searchId}>`} no existe
                            </p>
                        )}
                    </div>
                    <button className="cursor-pointer bg-teal-700 text-white px-4 py-2 rounded hover:bg-teal-800 transition-colors">
                        Crear usuario
                    </button>
                </div>

                {/* Table */}
                <div className="border rounded">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="text-left p-4">Id</th>
                                <th className="text-left p-4">Nombres y apellidos</th>
                                <th className="text-left p-4">Foto</th>
                                <th className="text-left p-4">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users?.map((user) => (
                                <tr key={user.id} className="border-b">
                                    <td className="p-4 text-gray-600">{user.id}</td>
                                    <td className="p-4">{user.firstName}</td>
                                    <td className="p-4">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                            <img
                                                src={user.picture || avatar}
                                                alt={user.name}
                                                className="w-6 h-6 rounded-full"
                                            />
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <button className="cursor-pointer text-gray-500 hover:text-gray-700">
                                                <img
                                                    width={24}
                                                    src={trash}
                                                    alt="Eliminar usuario"
                                                />
                                            </button>
                                            <button className="cursor-pointer text-gray-500 hover:text-gray-700">
                                                <img width={24} src={pen} alt="Modificar usuario" />
                                            </button>
                                            <button className="cursor-pointer text-gray-500 hover:text-gray-700">
                                                <img
                                                    width={24}
                                                    src={read}
                                                    alt="Ver datos del usuario"
                                                />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-center gap-2 mt-4">{paginator()}</div>
            </div>
        </div>
    );
};

export default App;
