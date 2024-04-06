/* This example requires Tailwind CSS v2.0+ */
import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { app } from '../../firebase/firebaseconfig'; 
import { format, subDays } from 'date-fns'; // You'll need to install date-fns if you haven't already


import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/solid'


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Stats() {

  const [totalRevenue, setTotalRevenue] = useState(0);
  const [previousDayRevenue, setPreviousDayRevenue] = useState(0); 
  
  const [stats, setStats] = useState([
    { name: 'Total Revenue', stat: '0', previousStat: '0', change: '0%', changeType: 'increase' },
    { name: 'Avg. Open Rate', stat: '58.16%', previousStat: '56.14%', change: '2.02%', changeType: 'increase' },
    { name: 'Avg. Click Rate', stat: '24.57%', previousStat: '28.62%', change: '4.05%', changeType: 'decrease' },
  ]);
  useEffect(() => {
    const db = getDatabase(app);
    const usersRef = ref(db, 'users');
    onValue(usersRef, (snapshot) => {
      const users = snapshot.val();
      let newTotalRevenue = 0;
      let newPrevDayRevenue = 0;
      const prevDay = format(subDays(new Date(), 1), 'yyyy-MM-dd');

      Object.values(users).forEach(user => {
        if (user.subscription && user.subscription.planPrice) {
          newTotalRevenue += Number(user.subscription.planPrice);
          if (user.subscriptionDate === prevDay) {
            newPrevDayRevenue += Number(user.subscription.planPrice);
          }
        }
      });

      setTotalRevenue(newTotalRevenue);
      setPreviousDayRevenue(newPrevDayRevenue);

      // Calculate the change in revenue
      const revenueChange = newTotalRevenue - newPrevDayRevenue;
      const changePercentage = newPrevDayRevenue > 0 ? ((revenueChange / newPrevDayRevenue) * 100).toFixed(2) : '0';
      const changeType = revenueChange >= 0 ? 'increase' : 'decrease';

      // Update the stats array dynamically
      setStats(currentStats => currentStats.map(item => {
        if (item.name === 'Total Revenue') {
          return { ...item, stat: `${newTotalRevenue}`, previousStat: `${newPrevDayRevenue}`, change: `${Math.abs(changePercentage)}%`, changeType: changeType };
        }
        return item;
      }));
    });
  }, []);

  return (
    <div>
      <h3 className="text-lg leading-6 font-medium text-[#828a95]">Last 30 days</h3>
        <dl className="mt-5 grid grid-cols-1 bg-neutral-950 rounded-lg overflow-hidden shadow divide-y divide-[#1f2734] border border-[#1f2734] md:grid-cols-3 md:divide-y-0 md:divide-x">
        {stats.map((item) => (
          <div key={item.name} className=" py-5 sm:p-6">
            <dt className="text-md Gilroy-Medium text-[#828a95]">{item.name} </dt>
            <dd className="mt-1 flex justify-between items-baseline md:block lg:flex">
              <div className="flex items-baseline text-2xl Gilroy-SemiBold text-white">
                ₹{item.stat}
               
                {/* <span className="ml-2 text-sm Gilroy-Medium text-gray-500">from {item.previousStat}</span> */}
              </div>

              <div
                className={classNames(
                  item.changeType === 'increase' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
                  'inline-flex items-baseline px-2.5 py-0.5 rounded-full text-sm font-medium md:mt-2 lg:mt-0'
                )}
              >
                {item.changeType === 'increase' ? (
                  <ArrowUpIcon
                    className="-ml-1 mr-0.5 flex-shrink-0 self-center h-5 w-5 text-green-500"
                    aria-hidden="true"
                  />
                ) : (
                  <ArrowDownIcon
                    className="-ml-1 mr-0.5 flex-shrink-0 self-center h-5 w-5 text-red-500"
                    aria-hidden="true"
                  />
                )}

                <span className="sr-only">{item.changeType === 'increase' ? 'Increased' : 'Decreased'} by</span>
                {item.change}
              </div>
            </dd>
          </div>
        ))}
      </dl>

      <div>
        
      </div>
    </div>
  )
}
