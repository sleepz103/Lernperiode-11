using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pomodoro
{
    internal class Countdown
    {
        public Countdown()
        {
            int initMinutes = 25;

            for (int i = initMinutes; i >= 0; i--)
            {
                Console.WriteLine(i);
                Thread.Sleep(100);
            }
        }


        private int Minutes2Seconds(int minutes)
        {
            return minutes * 60;
        }
    }
}
