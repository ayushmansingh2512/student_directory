import React, { useState, useEffect } from 'react';
import SectionTabs from '../components/SectionTabs';
import StudentCard from '../components/StudentCard';
import StudentModal from '../components/StudentModal';

const Home = () => {
    const [activeSection, setActiveSection] = useState('A');
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState(null);

    useEffect(() => {
        fetchStudents();
    }, [activeSection]);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/api/students?section=${activeSection}`);
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
        <div className="bg-bg-light">
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-extrabold text-text-main mb-3">KIET Student Directory</h1>
                    <p className="text-xl text-text-light max-w-2xl mx-auto">
                        Discover and connect with the talented students of KIET Group of Institutions.
                    </p>
                </div>

                <SectionTabs activeSection={activeSection} onSectionChange={setActiveSection} />

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-accent"></div>
                    </div>
                ) : students.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-lg text-gray-500">No students found in this section.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
