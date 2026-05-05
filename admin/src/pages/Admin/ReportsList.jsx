import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { StaffContext } from '../../context/StaffContext'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import SkeletonLoader from '../../components/SkeletonLoader'

const ReportsList = () => {
  const { aToken, reports: adminReports, getAllReports, patients, getAllPatients, addReport: adminAddReport, updateReportStatus: adminUpdateStatus } = useContext(AdminContext)
  const { sToken, reports: staffReports, getReports: getStaffReports, updateReportStatus: staffUpdateStatus } = useContext(StaffContext)
  
  const reports = aToken ? adminReports : staffReports;
  const addReport = aToken ? adminAddReport : () => { toast.error("Unauthorized") };
  const updateReportStatus = aToken ? adminUpdateStatus : staffUpdateStatus; 

  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [syncingId, setSyncingId] = useState(null)
  const [newReport, setNewReport] = useState({
    userId: '',
    testName: '',
    category: 'Blood Test'
  })

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true)
        if (aToken) {
            await Promise.all([getAllReports(), getAllPatients()])
        }
        if (sToken) {
            await getStaffReports()
        }
        setLoading(false)
    }
    fetchData()
  }, [aToken, sToken])

  const handleAddReport = async (e) => {
    e.preventDefault()
    if (!newReport.userId || !newReport.testName) {
      return toast.error("Please fill all fields")
    }
    const success = await addReport(newReport)
    if (success) {
      setShowModal(false)
      setNewReport({ userId: '', testName: '', category: 'Blood Test' })
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-200'
      case 'Processing': return 'bg-blue-50 text-blue-600 border-blue-200'
      case 'Completed': return 'bg-emerald-50 text-emerald-600 border-emerald-200'
      case 'Delivered': return 'bg-gray-50 text-gray-600 border-gray-200'
      default: return 'bg-gray-50 text-gray-600 border-gray-200'
    }
  }

  const filteredReports = reports.filter(report => 
    report.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (report.patientData && report.patientData.name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const simulateMachineSync = async (reportId) => {
    setSyncingId(reportId);
    await new Promise(r => setTimeout(r, 3000));
    updateReportStatus(reportId, 'Completed');
    setSyncingId(null);
    toast.success("Analyzer sync complete. Results attached.");
  }

  const printBarcode = (reportId) => {
    toast.info(`Generating barcode label for Report #${reportId.slice(-6)}...`);
    setTimeout(() => toast.success("Sent to Label Printer 🖨️"), 1000);
  }

  return (
    <div className='p-6 md:p-8 bg-gray-50 min-h-screen w-full'>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className='flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10'
      >
        <div>
          <h1 className='text-4xl font-extrabold text-slate-800 tracking-tight'>Diagnostic Reports</h1>
          <p className='text-slate-400 mt-2 font-light text-lg'>Track and manage all laboratory test results.</p>
        </div>
        <div className='flex items-center gap-3'>
          <div className='relative w-full md:w-72 group'>
            <div className='absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none'>
              <svg className='w-5 h-5 text-slate-400 group-focus-within:text-slate-900 transition-colors' fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
            <input
              type='text'
              placeholder='Search reports or patients...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='block w-full p-3.5 pl-12 text-sm text-slate-900 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-slate-900/10 focus:border-slate-900 transition-all shadow-sm'
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowModal(true)}
            className='flex items-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-lg shadow-slate-900/20 whitespace-nowrap hover:bg-slate-800 transition-all'
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Test
          </motion.button>
        </div>
      </motion.div>

      {/* Stat Summary Cards */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-10'>
        {[
          { label: 'Total Reports', value: reports.length, color: 'bg-slate-900 text-white', icon: '📄' },
          { label: 'Pending', value: reports.filter(r => r.status === 'Pending').length, color: 'bg-amber-50 text-amber-700', icon: '⏳' },
          { label: 'Processing', value: reports.filter(r => r.status === 'Processing').length, color: 'bg-blue-50 text-blue-700', icon: '🔬' },
          { label: 'Completed', value: reports.filter(r => r.status === 'Completed' || r.status === 'Delivered').length, color: 'bg-emerald-50 text-emerald-700', icon: '✅' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`${stat.color} rounded-2xl p-5 flex items-center gap-4 border border-slate-100 shadow-sm`}
          >
            <span className='text-3xl'>{stat.icon}</span>
            <div>
              <p className='text-3xl font-extrabold leading-none'>{stat.value}</p>
              <p className='text-xs font-bold uppercase tracking-widest opacity-70 mt-1'>{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className='bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden'>
        {loading ? (
            <SkeletonLoader type="table" rows={10} />
        ) : (
            <div className='overflow-x-auto'>
                <table className='w-full text-left border-collapse'>
                    <thead>
                    <tr className='bg-gray-50/50 border-b border-gray-100'>
                        <th className='px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider'>Patient</th>
                        <th className='px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider'>Test Name</th>
                        <th className='px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider'>Category</th>
                        <th className='px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider'>Status</th>
                        <th className='px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider'>Date</th>
                        <th className='px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider'>Lab Actions</th>
                        <th className='px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right'>Action</th>
                    </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-50'>
                    {filteredReports.map((report, index) => (
                        <motion.tr 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        key={report._id} 
                        className='hover:bg-gray-50/50 transition-colors group'
                        >
                        <td className='px-6 py-4'>
                            <div className='flex items-center gap-3'>
                            <div className='w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 font-bold border border-slate-200 overflow-hidden'>
                                {report.patientData?.image ? <img src={report.patientData.image} alt="" className="w-full h-full object-cover" /> : report.patientData?.name.charAt(0)}
                            </div>
                            <div>
                                <p className='font-bold text-gray-800'>{report.patientData?.name || 'Unknown Patient'}</p>
                                <p className='text-xs text-gray-400'>{report.patientData?.email || 'N/A'}</p>
                            </div>
                            </div>
                        </td>
                        <td className='px-6 py-4'>
                            <p className='font-medium text-gray-700'>{report.testName}</p>
                        </td>
                        <td className='px-6 py-4'>
                            <span className='text-xs px-2 py-1 bg-gray-100 rounded-md text-gray-600'>{report.category}</span>
                        </td>
                        <td className='px-6 py-4'>
                            <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${getStatusColor(report.status)}`}>
                            {report.status}
                            </span>
                        </td>
                        <td className='px-6 py-4'>
                            <p className='text-xs text-gray-500'>{new Date(report.date).toLocaleDateString()}</p>
                        </td>
                        <td className='px-6 py-4'>
                            <div className='flex flex-col gap-2'>
                                <button onClick={() => printBarcode(report._id)} className='px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-sm transition-all'>
                                  🖨️ Barcode
                                </button>
                                {report.status === 'Pending' && (
                                  <button 
                                    onClick={() => updateReportStatus(report._id, 'Processing')} 
                                    className='px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-xl shadow-sm transition-all flex items-center justify-center gap-1'
                                  >
                                    🧪 Process
                                  </button>
                                )}
                                {report.status === 'Processing' && (
                                  <button 
                                    onClick={() => simulateMachineSync(report._id)} 
                                    disabled={syncingId === report._id}
                                    className='px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 rounded-xl shadow-sm transition-all flex items-center justify-center gap-1'
                                  >
                                    {syncingId === report._id ? (
                                      <><span className='animate-spin'>⏳</span> Syncing...</>
                                    ) : '🔬 Sync Analyzer'}
                                  </button>
                                )}
                                {report.status === 'Completed' && (
                                  <div className='flex flex-col gap-1'>
                                    <span className='px-3 py-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center gap-1'>
                                      ✅ Synced
                                    </span>
                                    <button onClick={() => toast.success("Opening report editor...")} className='text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-all'>Attach PDF →</button>
                                  </div>
                                )}
                            </div>
                        </td>
                        <td className='px-6 py-4 text-right'>
                            <select 
                            value={report.status}
                            onChange={(e) => updateReportStatus(report._id, e.target.value)}
                            className='text-xs bg-white border border-gray-200 rounded-lg p-1.5 focus:ring-2 focus:ring-slate-900/10'
                            >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Completed">Completed</option>
                            <option value="Delivered">Delivered</option>
                            </select>
                        </td>
                        </motion.tr>
                    ))}
                    </tbody>
                </table>
                
                {filteredReports.length === 0 && (
                    <div className='py-20 text-center'>
                    <div className='text-4xl mb-4'>📄</div>
                    <p className='text-gray-500 font-light'>No diagnostic reports found.</p>
                    </div>
                )}
            </div>
        )}
      </div>

      {/* Add Report Modal */}
      <AnimatePresence>
        {showModal && (
          <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm'>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className='bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden'
            >
              <div className='bg-slate-900 p-6 text-white'>
                <h2 className='text-xl font-bold'>Initiate New Diagnostic Test</h2>
                <p className='text-slate-300 text-sm opacity-80'>Assign a laboratory test to a registered patient.</p>
              </div>
              
              <form onSubmit={handleAddReport} className='p-6 space-y-4'>
                <div>
                  <label className='block text-xs font-bold text-gray-500 uppercase mb-1.5'>Select Patient</label>
                  <select 
                    value={newReport.userId}
                    onChange={(e) => setNewReport({...newReport, userId: e.target.value})}
                    className='w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900/20 transition-all'
                    required
                  >
                    <option value="">Choose a patient...</option>
                    {patients.map(p => (
                      <option key={p._id} value={p._id}>{p.name} ({p.email})</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className='block text-xs font-bold text-gray-500 uppercase mb-1.5'>Test Name</label>
                  <input 
                    type='text' 
                    placeholder='e.g. Complete Blood Count' 
                    value={newReport.testName}
                    onChange={(e) => setNewReport({...newReport, testName: e.target.value})}
                    className='w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900/20 transition-all'
                    required
                  />
                </div>

                <div>
                  <label className='block text-xs font-bold text-gray-500 uppercase mb-1.5'>Category</label>
                  <select 
                    value={newReport.category}
                    onChange={(e) => setNewReport({...newReport, category: e.target.value})}
                    className='w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900/20 transition-all'
                  >
                    <option value="Blood Test">Blood Test</option>
                    <option value="MRI/CT Scan">MRI/CT Scan</option>
                    <option value="X-Ray">X-Ray</option>
                    <option value="Urine Test">Urine Test</option>
                    <option value="Biopsy">Biopsy</option>
                    <option value="Other">Other</option>
                  </select>
                </div>



                <div className='flex gap-3 pt-4'>
                  <button 
                    type='button'
                    onClick={() => setShowModal(false)}
                    className='flex-1 py-3 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-xl transition-all'
                  >
                    Cancel
                  </button>
                  <button 
                    type='submit'
                    className='flex-1 py-3 text-sm font-bold bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-900/20 hover:scale-[1.02] transition-all'
                  >
                    Create Test
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ReportsList
