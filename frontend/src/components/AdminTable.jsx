import React from 'react';

const AdminTable = ({ items = [], columns = [] }) => {
  if (!items.length) {
    return (
      <div className="admin-section text-center text-white/60">
        <p>No data available yet.</p>
      </div>
    );
  }

  return (
    <div className="admin-section overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="text-white/60 uppercase tracking-widest text-xs">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="py-3 px-4">{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-t border-white/10 hover:bg-white/5">
              {columns.map((column) => (
                <td key={column.key} className="py-3 px-4 text-white/80">
                  {column.render ? column.render(item[column.key], item) : item[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;
