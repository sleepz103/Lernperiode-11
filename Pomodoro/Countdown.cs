using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pomodoro
{
    internal class Countdown
    {
        private int _minutes;
        private int _seconds = 0;

        public Countdown(int minutes)
        {
            _minutes = minutes;
            Console.Clear();
            Console.WriteLine("{0}:{1}", _minutes.ToString("00"), _seconds.ToString("00"));
            Thread.Sleep(1000);
            Console.Clear();
            for (int i = 0; i < minutes*60-1; i++)
            {
                if(_seconds == 0)
                {
                    _minutes--;
                    _seconds = 60;
                }
                _seconds--;
                Console.WriteLine("{0}:{1}", _minutes.ToString("00"), _seconds.ToString("00"));
                Thread.Sleep(1000);
                Console.Clear();
            }
        }
    }
}
