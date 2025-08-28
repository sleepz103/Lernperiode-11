namespace Pomodoro
{
    internal class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Enter 1 to begin");
            string userInput = Console.ReadLine();
            Countdown countdown = new Countdown(1);
        }
    }
}
