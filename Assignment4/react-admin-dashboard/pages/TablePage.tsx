import React, { useState, useMemo, useCallback } from 'react';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { mockTableData } from '../services/mockData';
import { TableRow, User } from '../types';
import { EditIcon, TrashIcon, ArrowUpIcon, ArrowDownIcon, PlusIcon, SearchIcon } from '../components/Icons';
import LoadingSpinner from '../components/LoadingSpinner'; // Assuming this exists for general use

type SortDirection = 'asc' | 'desc';
interface SortConfig {
  key: keyof TableRow | null;
  direction: SortDirection;
}

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 15, 20];

const TablePage: React.FC = () => {
  const [data, setData] = useState<TableRow[]>(mockTableData);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_OPTIONS[1]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<TableRow | null>(null);
  const [newUser, setNewUser] = useState<Partial<TableRow>>({ name: '', email: '', role: 'Viewer', status: 'Pending' });


  const filteredData = useMemo(() => {
    return data.filter((item) =>
      Object.values(item).some(val =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  const sortedData = useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const valA = a[sortConfig.key!];
        const valB = b[sortConfig.key!];
        if (valA === undefined || valB === undefined) return 0;

        if (typeof valA === 'number' && typeof valB === 'number') {
            return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
        }
        if (typeof valA === 'string' && typeof valB === 'string') {
            return sortConfig.direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        // Fallback for other types or mixed types
        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();
        return sortConfig.direction === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const requestSort = (key: keyof TableRow) => {
    let direction: SortDirection = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleEdit = (user: TableRow) => {
    setCurrentUser(user);
    setIsEditModalOpen(true);
  };

  const handleDelete = (user: TableRow) => {
    setCurrentUser(user);
    setIsDeleteModalOpen(true);
  };
  
  const handleAddUser = () => {
    setNewUser({ name: '', email: '', role: 'Viewer', status: 'Pending', joinedDate: new Date().toISOString().split('T')[0]});
    setIsAddModalOpen(true);
  };

  const confirmDelete = () => {
    if (currentUser) {
      setData(data.filter(item => item.id !== currentUser.id));
    }
    setIsDeleteModalOpen(false);
    setCurrentUser(null);
  };

  const handleSave = (updatedUser: TableRow) => {
    setData(data.map(item => (item.id === updatedUser.id ? updatedUser : item)));
    setIsEditModalOpen(false);
    setCurrentUser(null);
  };
  
  const handleAddNewUser = () => {
    if (newUser.name && newUser.email) {
        const userToAdd: TableRow = {
            id: Date.now(), // Simple unique ID
            ...newUser,
            joinedDate: newUser.joinedDate || new Date().toISOString().split('T')[0],
        };
        setData([userToAdd, ...data]);
        setIsAddModalOpen(false);
        setNewUser({ name: '', email: '', role: 'Viewer', status: 'Pending'});
    } else {
        alert("Name and Email are required.");
    }
  };


  const columns: { key: keyof TableRow; header: string; sortable?: boolean, render?: (row: TableRow) => React.ReactNode }[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    { key: 'role', header: 'Role', sortable: true },
    { key: 'status', header: 'Status', sortable: true, render: (row) => (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
            row.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100' :
            row.status === 'Pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-100' :
            'bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100' // Inactive
        }`}>
            {row.status}
        </span>
    )},
    { key: 'joinedDate', header: 'Joined Date', sortable: true },
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (!paginatedData) return <LoadingSpinner text="Loading table data..." />

  return (
    <div className="space-y-6">
      <Card title="User Management" actions={
        <button
            onClick={handleAddUser}
            className="flex items-center bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
        >
            <PlusIcon className="w-5 h-5 mr-2" /> Add User
        </button>
      }>
        <div className="mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-secondary-400 dark:text-secondary-500" />
            </div>
            <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full md:w-1/3 pl-10 pr-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md leading-5 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100 placeholder-secondary-400 dark:placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-secondary-200 dark:divide-secondary-700">
            <thead className="bg-secondary-50 dark:bg-secondary-700/50">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key as string}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-300 uppercase tracking-wider cursor-pointer select-none"
                    onClick={() => col.sortable && requestSort(col.key)}
                  >
                    <div className="flex items-center">
                      {col.header}
                      {col.sortable && sortConfig.key === col.key && (
                        sortConfig.direction === 'asc' ? <ArrowUpIcon className="w-4 h-4 ml-1" /> : <ArrowDownIcon className="w-4 h-4 ml-1" />
                      )}
                    </div>
                  </th>
                ))}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-secondary-800 divide-y divide-secondary-200 dark:divide-secondary-700">
              {paginatedData.map((row) => (
                <tr key={row.id} className="hover:bg-secondary-50 dark:hover:bg-secondary-700/30 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key as string} className="px-6 py-4 whitespace-nowrap text-sm text-secondary-700 dark:text-secondary-300">
                      {col.render ? col.render(row) : String(row[col.key])}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button onClick={() => handleEdit(row)} className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200 p-1" title="Edit">
                      <EditIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(row)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 p-1" title="Delete">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
            <div className="mt-4 flex flex-col sm:flex-row justify-between items-center">
                <div className="text-sm text-secondary-700 dark:text-secondary-300 mb-2 sm:mb-0">
                    Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, sortedData.length)}</span> of <span className="font-medium">{sortedData.length}</span> results
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border border-secondary-300 dark:border-secondary-600 rounded-md text-sm hover:bg-secondary-100 dark:hover:bg-secondary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-1 border rounded-md text-sm ${currentPage === page ? 'bg-primary-500 text-white border-primary-500' : 'border-secondary-300 dark:border-secondary-600 hover:bg-secondary-100 dark:hover:bg-secondary-700'}`}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border border-secondary-300 dark:border-secondary-600 rounded-md text-sm hover:bg-secondary-100 dark:hover:bg-secondary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                    <select 
                        value={itemsPerPage} 
                        onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                        className="px-2 py-1 border border-secondary-300 dark:border-secondary-600 rounded-md text-sm bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100 focus:ring-primary-500 focus:border-primary-500"
                    >
                        {ITEMS_PER_PAGE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt} per page</option>)}
                    </select>
                </div>
            </div>
        )}
      </Card>

      {/* Edit Modal */}
      {isEditModalOpen && currentUser && (
        <Modal title="Edit User" isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}
          footer={
            <>
              <button onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-sm font-medium text-secondary-700 dark:text-secondary-300 bg-secondary-100 dark:bg-secondary-600 hover:bg-secondary-200 dark:hover:bg-secondary-500 rounded-lg">Cancel</button>
              <button onClick={() => handleSave(currentUser)} className="px-4 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-lg">Save Changes</button>
            </>
          }
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="edit-name" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">Name</label>
              <input type="text" id="edit-name" value={currentUser.name as string} onChange={(e) => setCurrentUser({...currentUser, name: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-secondary-700 dark:text-white" />
            </div>
            <div>
              <label htmlFor="edit-email" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">Email</label>
              <input type="email" id="edit-email" value={currentUser.email as string} onChange={(e) => setCurrentUser({...currentUser, email: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-secondary-700 dark:text-white" />
            </div>
            <div>
              <label htmlFor="edit-role" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">Role</label>
              <select id="edit-role" value={currentUser.role as string} onChange={(e) => setCurrentUser({...currentUser, role: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-secondary-700 dark:text-white">
                <option>Admin</option>
                <option>Editor</option>
                <option>Viewer</option>
              </select>
            </div>
             <div>
              <label htmlFor="edit-status" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">Status</label>
              <select id="edit-status" value={currentUser.status as string} onChange={(e) => setCurrentUser({...currentUser, status: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-secondary-700 dark:text-white">
                <option>Active</option>
                <option>Pending</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && currentUser && (
        <Modal title="Confirm Deletion" isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}
          footer={
            <>
              <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 text-sm font-medium text-secondary-700 dark:text-secondary-300 bg-secondary-100 dark:bg-secondary-600 hover:bg-secondary-200 dark:hover:bg-secondary-500 rounded-lg">Cancel</button>
              <button onClick={confirmDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg">Delete</button>
            </>
          }
        >
          <p className="text-secondary-700 dark:text-secondary-300">Are you sure you want to delete user "{currentUser.name}"? This action cannot be undone.</p>
        </Modal>
      )}
      
      {/* Add User Modal */}
      {isAddModalOpen && (
        <Modal title="Add New User" isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}
          footer={
            <>
              <button onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-sm font-medium text-secondary-700 dark:text-secondary-300 bg-secondary-100 dark:bg-secondary-600 hover:bg-secondary-200 dark:hover:bg-secondary-500 rounded-lg">Cancel</button>
              <button onClick={handleAddNewUser} className="px-4 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-lg">Add User</button>
            </>
          }
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="add-name" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">Name *</label>
              <input type="text" id="add-name" value={newUser.name as string} onChange={(e) => setNewUser({...newUser, name: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-secondary-700 dark:text-white" />
            </div>
            <div>
              <label htmlFor="add-email" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">Email *</label>
              <input type="email" id="add-email" value={newUser.email as string} onChange={(e) => setNewUser({...newUser, email: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-secondary-700 dark:text-white" />
            </div>
            <div>
              <label htmlFor="add-role" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">Role</label>
              <select id="add-role" value={newUser.role as string} onChange={(e) => setNewUser({...newUser, role: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-secondary-700 dark:text-white">
                <option>Admin</option>
                <option>Editor</option>
                <option selected>Viewer</option>
              </select>
            </div>
             <div>
              <label htmlFor="add-status" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">Status</label>
              <select id="add-status" value={newUser.status as string} onChange={(e) => setNewUser({...newUser, status: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-secondary-700 dark:text-white">
                <option>Active</option>
                <option selected>Pending</option>
                <option>Inactive</option>
              </select>
            </div>
            <div>
                <label htmlFor="add-joinedDate" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">Joined Date</label>
                <input type="date" id="add-joinedDate" value={newUser.joinedDate as string || new Date().toISOString().split('T')[0]} onChange={(e) => setNewUser({...newUser, joinedDate: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-secondary-700 dark:text-white" />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TablePage;
