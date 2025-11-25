import React, { useState, useEffect } from 'react';
import StudentCard from '../components/StudentCard';
import StudentModal from '../components/StudentModal';
import SectionTabs from '../components/SectionTabs';
import { API_URL } from '../config';

const Home = () => {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [activeSection, setActiveSection] = useState('A');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStudents();
    }, [activeSection]);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/students?section=${activeSection}`);
            if (!response.ok) throw new Error('Failed to fetch students');

            const data = await response.json();
            setStudents(data);
        } catch (error) {
            console.error('Error fetching students:', error);
            setStudents([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

                {/* RESPONSIVE HERO SECTION */}
                <div className="text-center mb-10 sm:mb-12 bg-gradient-to-br from-yellow-50 to-amber-50 
                                rounded-xl sm:rounded-2xl border-2 sm:border-4 border-gray-900 overflow-hidden">

                    {/* Header Strip */}
                    <div className="bg-gray-900 text-yellow-50 px-4 sm:px-8 py-4 sm:py-6 border-b-4 border-gray-900">
                        <h1 className="text-3xl sm:text-5xl font-black tracking-wide uppercase">
                            KIET Student Directory
                        </h1>
                        <p className="text-base sm:text-lg text-yellow-300 mt-1 sm:mt-2 font-semibold tracking-wide">
                            OFFICIAL STUDENT PASS SYSTEM
                        </p>
                    </div>

                    {/* Body */}
                    <div className="py-6 sm:py-12 px-4 sm:px-8">
                        <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto font-semibold">
                            Discover and connect with the talented students of KIET Group of Institutions.
                        </p>
                    </div>

                    {/* Bottom Barcode Strip */}
                    <div className="bg-gray-900 px-4 sm:px-8 py-3 sm:py-4 border-t-4 border-gray-900">
                        <div className="h-10 sm:h-12 bg-gradient-to-r from-yellow-50 via-gray-700 to-yellow-50 bg-[length:4px_100%] bg-repeat-x opacity-40"></div>
                    </div>
                </div>

                <SectionTabs activeSection={activeSection} onSectionChange={setActiveSection} />

                {/* LOADING */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 
                                        border-b-4 border-gray-900"></div>
                    </div>
                ) : students.length === 0 ? (
                    <div className="text-center py-16 sm:py-20">
                        <p className="text-lg text-gray-500">No students found in this section.</p>
                    </div>
                ) : (

                    /* RESPONSIVE GRID */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-6 sm:mt-8">
                        {students.map((student) => (
                            <StudentCard
                                key={student.id}
                                student={student}
                                onClick={setSelectedStudent}
                            />
                        ))}
                    </div>
                )}
            </main>

            {selectedStudent && (
                <StudentModal
                    student={selectedStudent}
                    onClose={() => setSelectedStudent(null)}
                />
            )}
        </div>
    );
};

export default Home;
