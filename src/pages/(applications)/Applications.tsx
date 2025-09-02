import PageTitleArea from '../../components/shared/PageTitleArea';
import StatusTag from '../../components/shared/StatusTag';
import Button from '../../components/shared/Button';

type Application = {
  id: string;
  applicant: string;
  appId: string;
  program: string;
  status: 'Submitted' | 'Under decision' | 'Ready for decision' | 'Admitted';
  updatedOn: string;
  reviewer: string;
  gpa: string;
  sat: string;
};

const applications: Application[] = [
  {
    id: 'ap1',
    applicant: 'Alice Johnson',
    appId: 'APP-2025-001',
    program: 'B.S. Computer Science',
    status: 'Submitted',
    updatedOn: '25/07/2025',
    reviewer: 'System',
    gpa: '3.95',
    sat: '1420',
  },
  {
    id: 'ap2',
    applicant: 'Michael Chen',
    appId: 'APP-2025-001',
    program: 'B.S. Computer Science',
    status: 'Under decision',
    updatedOn: '28/07/2025',
    reviewer: 'Dr. Smith',
    gpa: '3.85',
    sat: '1400',
  },
  {
    id: 'ap3',
    applicant: 'Sarah Williams',
    appId: 'APP-2025-001',
    program: 'B.S. Computer Science',
    status: 'Ready for decision',
    updatedOn: '28/07/2025',
    reviewer: 'Review Committee',
    gpa: '3.9',
    sat: '1420',
  },
  {
    id: 'ap4',
    applicant: 'David Brown',
    appId: 'APP-2025-001',
    program: 'B.S. Computer Science',
    status: 'Admitted',
    updatedOn: '28/07/2025',
    reviewer: 'Admissions Committee',
    gpa: '3.85',
    sat: '1420',
  },
];

export default function ApplicationsPage() {
  return (
    <div className={'relative pb-32'}>
      <PageTitleArea title={'Applications'}>
        <div className={'flex items-center gap-8'}>
          <input className={'rounded-12 bg-bgSec text-textHeadline placeholder:text-textDescription h-40 w-300 max-md:w-full px-12 outline-none border border-linePr'} placeholder={'Search applications...'} />
          <select className={'rounded-12 bg-bgSec h-40 px-12 outline-none border border-linePr'}>
            <option>All Statuses</option>
            <option>Submitted</option>
            <option>Under decision</option>
            <option>Ready for decision</option>
            <option>Admitted</option>
          </select>
          <select className={'rounded-12 bg-bgSec h-40 px-12 outline-none border border-linePr'}>
            <option>All Programs</option>
          </select>
        </div>
      </PageTitleArea>

      <div className={'px-24 max-md:px-16'}>
        <div className={'rounded-16 border border-linePr bg-bgSec'}>
          <div className={'overflow-auto'}>
            <table className={'min-w-[860px] w-full border-collapse'}>
              <thead>
                <tr className={'text-left text-textDescription text-12'}>
                  <th className={'px-12 py-8'}>Applicant</th>
                  <th className={'px-12 py-8'}>Program & Status</th>
                  <th className={'px-12 py-8'}>Last Updated</th>
                  <th className={'px-12 py-8'}>Review Progress</th>
                  <th className={'px-12 py-8'}>Academic Info</th>
                  <th className={'px-12 py-8'}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className={'border-t border-linePr'}>
                    <td className={'px-12 py-10'}>
                      <div className={'grid gap-4'}>
                        <p className={'text-textHeadline text-14 font-medium'}>{app.applicant}</p>
                        <p className={'text-textDescription text-12'}>{app.appId}</p>
                      </div>
                    </td>
                    <td className={'px-12 py-10'}>
                      <div className={'grid gap-4'}>
                        <p className={'text-textHeadline text-14'}>{app.program}</p>3





                        
                        <div>
                          {app.status === 'Submitted' && (
                            <StatusTag status={'pending'}>Submitted</StatusTag>
                          )}
                          {app.status === 'Under decision' && (
                            <StatusTag status={'draft'}>Under decision</StatusTag>
                          )}
                          {app.status === 'Ready for decision' && (
                            <StatusTag status={'pending'}>Ready for decision</StatusTag>
                          )}
                          {app.status === 'Admitted' && (
                            <StatusTag status={'success'}>Admitted</StatusTag>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className={'px-12 py-10'}>
                      <div className={'grid gap-4'}>
                        <p className={'text-textHeadline text-14'}>{app.updatedOn}</p>
                        <p className={'text-textDescription text-12'}>{app.reviewer}</p>
                      </div>
                    </td>
                    <td className={'px-12 py-10 text-textDescription text-12'}>8.2 / 10</td>
                    <td className={'px-12 py-10 text-textDescription text-12'}>
                      GPA: {app.gpa}
                      <br />
                      SAT: {app.sat}
                    </td>
                    <td className={'px-12 py-10 text-right'}>
                      <Button size={'sm'} style={'gray-border'}>View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}


