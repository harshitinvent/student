import AnalyticCard from '../../shared/AnalyticCard';
import RevenuePanel from '../../widgets/RevenuePanel';
import DevicesPanel from '../../widgets/DevicesPanel';

export default function SummarySection() {
  return (
    <>
      <div
        className={
          'gap-18 max-md:flex max-md:overflow-x-auto max-md:px-16 md:grid md:grid-cols-3 max-md:[&>*]:shrink-0'
        }
      >
        <AnalyticCard
          title={'Total customers'}
          number={'2,420'}
          percent={40}
          positive={true}
        />
        <AnalyticCard
          title={'Members'}
          number={'1,210'}
          percent={10}
          positive={false}
        />
        <AnalyticCard
          title={'Total customers'}
          number={'2,420'}
          percent={40}
          positive={true}
        />
      </div>

      <div
        className={'mt-16 grid gap-16 max-md:px-16 md:grid-cols-[1.8fr_1fr]'}
      >
        <RevenuePanel />
        <DevicesPanel />
      </div>
    </>
  );
}
